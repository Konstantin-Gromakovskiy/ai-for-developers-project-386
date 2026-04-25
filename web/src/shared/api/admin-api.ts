import { apiClient, unwrapNoContent, unwrapResponse } from './client'

import type {
  CreateAvailabilityOverrideRequest,
  CreateEventTypeRequest,
  ReplaceAvailabilityRequest,
  UpdateAvailabilityOverrideRequest,
  UpdateEventTypeRequest,
} from './contracts'

export async function getAvailability() {
  return unwrapResponse(apiClient.GET('/admin/availability'))
}

export async function replaceAvailability(payload: ReplaceAvailabilityRequest) {
  return unwrapResponse(
    apiClient.PUT('/admin/availability', {
      body: payload,
    }),
  )
}

export async function listAvailabilityOverrides() {
  return unwrapResponse(apiClient.GET('/admin/availability-overrides'))
}

export async function createAvailabilityOverride(payload: CreateAvailabilityOverrideRequest) {
  return unwrapResponse(
    apiClient.POST('/admin/availability-overrides', {
      body: payload,
    }),
  )
}

export async function updateAvailabilityOverride(
  id: string,
  payload: UpdateAvailabilityOverrideRequest,
) {
  return unwrapResponse(
    apiClient.PATCH('/admin/availability-overrides/{id}', {
      body: payload,
      params: {
        path: { id },
      },
    }),
  )
}

export async function deleteAvailabilityOverride(id: string) {
  return unwrapNoContent(
    apiClient.DELETE('/admin/availability-overrides/{id}', {
      params: {
        path: { id },
      },
    }),
  )
}

export async function listAdminBookings() {
  return unwrapResponse(apiClient.GET('/admin/bookings'))
}

export async function listAdminEventTypes() {
  return unwrapResponse(apiClient.GET('/admin/event-types'))
}

export async function createEventType(payload: CreateEventTypeRequest) {
  return unwrapResponse(
    apiClient.POST('/admin/event-types', {
      body: payload,
    }),
  )
}

export async function updateEventType(id: string, payload: UpdateEventTypeRequest) {
  return unwrapResponse(
    apiClient.PATCH('/admin/event-types/{id}', {
      body: payload,
      params: {
        path: { id },
      },
    }),
  )
}

export async function deleteEventType(id: string) {
  return unwrapNoContent(
    apiClient.DELETE('/admin/event-types/{id}', {
      params: {
        path: { id },
      },
    }),
  )
}
