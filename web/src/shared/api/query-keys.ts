export const queryKeys = {
  publicEventTypes: ['public-event-types'] as const,
  publicEventType: (slug: string) => ['public-event-type', slug] as const,
  eventTypeSlots: (slug: string) => ['event-type-slots', slug] as const,
}
