export type EventTypeOption = {
  slug: string
  durationMinutes: number
  messageKey: 'quickCall' | 'standardCall'
}

export const hostProfile = {
  avatarLabel: 'T',
  name: 'Tota',
}

export const eventTypeOptions: EventTypeOption[] = [
  {
    slug: '15-min',
    durationMinutes: 15,
    messageKey: 'quickCall',
  },
  {
    slug: '30-min',
    durationMinutes: 30,
    messageKey: 'standardCall',
  },
]

export function getEventTypeOption(slug: string) {
  return eventTypeOptions.find(eventType => eventType.slug === slug)
}
