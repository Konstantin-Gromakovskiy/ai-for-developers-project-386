import { spawn } from 'node:child_process'
import { join } from 'node:path'

const proxyTarget = process.env.PRISM_PROXY_TARGET

if (!proxyTarget) {
  console.error('Set PRISM_PROXY_TARGET to your backend URL, for example http://127.0.0.1:3001')
  process.exit(1)
}

const prismBinary = process.platform === 'win32'
  ? join(process.cwd(), 'node_modules', '.bin', 'prism.cmd')
  : join(process.cwd(), 'node_modules', '.bin', 'prism')

const child = spawn(
  prismBinary,
  ['proxy', '../typespec/tsp-output/openapi.json', proxyTarget, '--port', '4010'],
  {
    stdio: 'inherit',
  },
)

child.on('exit', (code) => {
  process.exit(code ?? 1)
})
