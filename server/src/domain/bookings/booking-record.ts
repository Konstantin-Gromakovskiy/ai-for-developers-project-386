export type BookingRecord = {
  id: string
  eventTypeId: string
  guestName: string
  guestEmail: string
  guestNotes?: string
  startUtc: string
  endUtc: string
  createdAt: string
}

export type SlotRecord = {
  startUtc: string
  endUtc: string
}
