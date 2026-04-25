export const queryKeys = {
  adminAvailability: ['admin-availability'] as const,
  adminAvailabilityOverrides: ['admin-availability-overrides'] as const,
  adminEventTypes: ['admin-event-types'] as const,
  publicEventTypes: ['public-event-types'] as const,
  publicEventType: (slug: string) => ['public-event-type', slug] as const,
  eventTypeSlots: (slug: string) => ['event-type-slots', slug] as const,
}
