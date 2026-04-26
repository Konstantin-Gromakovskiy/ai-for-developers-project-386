export type EventTypeRecord = {
  id: string
  slug: string
  title: string
  description?: string
  durationMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PublicEventType = Pick<
  EventTypeRecord,
  'slug' | 'title' | 'description' | 'durationMinutes'
>
