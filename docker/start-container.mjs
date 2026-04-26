import { spawn } from 'node:child_process'
import http from 'node:http'
import net from 'node:net'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const externalPort = Number(process.env.PORT || 3000)
const webPort = Number(process.env.INTERNAL_WEB_PORT || 3100)
const apiPort = Number(process.env.INTERNAL_API_PORT || 3101)
const currentFilePath = fileURLToPath(import.meta.url)
const rootDirectory = dirname(dirname(currentFilePath))

function startProcess(name, command, args, options) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  })

  child.on('exit', (code, signal) => {
    console.error(`${name} exited with ${signal ?? code ?? 'unknown status'}`)
    process.exit(code ?? 1)
  })

  return child
}

function waitForPort(port, host = '127.0.0.1', timeoutMs = 30_000) {
  const startedAt = Date.now()

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const socket = net.createConnection({ host, port })

      socket.once('connect', () => {
        socket.end()
        resolve(true)
      })

      socket.once('error', () => {
        socket.destroy()

        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Timed out waiting for port ${port}`))
          return
        }

        setTimeout(tryConnect, 250)
      })
    }

    tryConnect()
  })
}

function shouldProxyToBackend(request) {
  const requestUrl = new URL(request.url || '/', 'http://127.0.0.1')
  const pathname = requestUrl.pathname
  const acceptHeader = request.headers.accept || ''
  const contentType = request.headers['content-type'] || ''

  if (pathname === '/health') {
    return true
  }

  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') {
    return false
  }

  if (pathname.startsWith('/event-types')) {
    return true
  }

  if (pathname.startsWith('/admin/availability-overrides')) {
    return true
  }

  if (pathname.startsWith('/admin')) {
    if (request.method && !['GET', 'HEAD'].includes(request.method)) {
      return true
    }

    if (contentType.includes('application/json')) {
      return true
    }

    if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
      return true
    }
  }

  return false
}

function createProxyServer() {
  return http.createServer((request, response) => {
    const targetPort = shouldProxyToBackend(request) ? apiPort : webPort
    const proxyRequest = http.request(
      {
        hostname: '127.0.0.1',
        port: targetPort,
        path: request.url,
        method: request.method,
        headers: {
          ...request.headers,
          host: `127.0.0.1:${targetPort}`,
        },
      },
      (proxyResponse) => {
        response.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers)
        proxyResponse.pipe(response)
      },
    )

    proxyRequest.on('error', (error) => {
      if (!response.headersSent) {
        response.writeHead(502, { 'content-type': 'application/json' })
      }

      response.end(JSON.stringify({ message: `Upstream unavailable: ${error.message}` }))
    })

    request.pipe(proxyRequest)
  })
}

const serverProcess = startProcess(
  'server',
  process.execPath,
  ['dist/main.js'],
  {
    cwd: join(rootDirectory, 'server'),
    env: {
      ...process.env,
      PORT: String(apiPort),
    },
  },
)

const webProcess = startProcess(
  'web',
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '-p', String(webPort), '-H', '127.0.0.1'],
  {
    cwd: join(rootDirectory, 'web'),
    env: {
      ...process.env,
      NEXT_PUBLIC_API_BASE_URL: '',
      PORT: String(webPort),
    },
  },
)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    serverProcess.kill(signal)
    webProcess.kill(signal)
    process.exit(0)
  })
}

await Promise.all([
  waitForPort(apiPort),
  waitForPort(webPort),
])

const proxyServer = createProxyServer()

proxyServer.listen(externalPort, '0.0.0.0')
await once(proxyServer, 'listening')

console.log(`Proxy server is listening on port ${externalPort}`)
