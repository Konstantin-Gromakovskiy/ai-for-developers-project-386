import type { components, operations, paths } from './schema'

export type ApiPaths = paths
export type ApiOperations = operations
export type ApiSchemas = components['schemas']

export type AvailabilityConfiguration = components['schemas']['AvailabilityConfiguration']
export type AvailabilityOverride = components['schemas']['AvailabilityOverride']
export type Booking = components['schemas']['Booking']
export type CreateAvailabilityOverrideRequest = components['schemas']['CreateAvailabilityOverrideRequest']
export type CreateBookingRequest = components['schemas']['CreateBookingRequest']
export type CreateEventTypeRequest = components['schemas']['CreateEventTypeRequest']
export type EventType = components['schemas']['EventType']
export type PublicEventType = components['schemas']['PublicEventType']
export type PublicEventTypeSummary = components['schemas']['PublicEventTypeSummary']
export type ReplaceAvailabilityRequest = components['schemas']['ReplaceAvailabilityRequest']
export type Slot = components['schemas']['Slot']
export type UpdateAvailabilityOverrideRequest = components['schemas']['UpdateAvailabilityOverrideRequest']
export type UpdateEventTypeRequest = components['schemas']['UpdateEventTypeRequest']
