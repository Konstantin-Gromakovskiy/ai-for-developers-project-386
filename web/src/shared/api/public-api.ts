import { apiClient, unwrapResponse } from './client'

import type { CreateBookingRequest } from './contracts'

export async function listPublicEventTypes() {
  return unwrapResponse(apiClient.GET('/event-types'))
}

export async function getPublicEventType(slug: string) {
  return unwrapResponse(
    apiClient.GET('/event-types/{slug}', {
      params: {
        path: { slug },
      },
    }),
  )
}

export async function listEventTypeSlots(slug: string) {
  return unwrapResponse(
    apiClient.GET('/event-types/{slug}/slots', {
      params: {
        path: { slug },
      },
    }),
  )
}

export async function createBooking(slug: string, payload: CreateBookingRequest) {
  return unwrapResponse(
    apiClient.POST('/event-types/{slug}/bookings', {
      body: payload,
      params: {
        path: { slug },
      },
    }),
  )
}

export async function getHealthStatus() {
  return unwrapResponse(apiClient.GET('/health'))
}
