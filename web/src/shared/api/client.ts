import createClient from 'openapi-fetch'

import type { paths } from './schema'

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:4010'

export type ApiClient = ReturnType<typeof createApiClient>

export class ApiError<TPayload = unknown> extends Error {
  status: number
  payload: TPayload | null

  constructor(status: number, payload: TPayload | null, message?: string) {
    super(message ?? `API request failed with status ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
}

export function createApiClient(baseUrl = getApiBaseUrl()) {
  return createClient<paths>({
    baseUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
}

export const apiClient = createApiClient()

export async function unwrapResponse<TData, TError>(
  request: Promise<{
    data?: TData
    error?: TError
    response: Response
  }>,
) {
  const { data, error, response } = await request

  if (error) {
    throw new ApiError(response.status, error)
  }

  if (typeof data === 'undefined') {
    throw new ApiError(response.status, null, 'API response body is empty')
  }

  return data
}

export async function unwrapNoContent<TError>(
  request: Promise<{
    error?: TError
    response: Response
  }>,
) {
  const { error, response } = await request

  if (error) {
    throw new ApiError(response.status, error)
  }
}
