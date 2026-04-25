export type BookingSlot = {
  time: string
  status: 'busy' | 'free'
}

export const defaultBookingMonth = '2026-03-01'
export const defaultSelectedDate = '2026-03-31'

export const slotsByDate: Record<string, BookingSlot[]> = {
  '2026-03-31': [
    { time: '09:00 - 09:15', status: 'busy' },
    { time: '09:15 - 09:30', status: 'busy' },
    { time: '09:30 - 09:45', status: 'busy' },
    { time: '09:45 - 10:00', status: 'free' },
    { time: '10:00 - 10:15', status: 'free' },
    { time: '10:15 - 10:30', status: 'free' },
    { time: '10:30 - 10:45', status: 'free' },
  ],
  '2026-03-30': [
    { time: '11:00 - 11:15', status: 'busy' },
    { time: '11:15 - 11:30', status: 'free' },
    { time: '11:30 - 11:45', status: 'free' },
    { time: '11:45 - 12:00', status: 'free' },
  ],
  '2026-04-01': [
    { time: '13:00 - 13:15', status: 'busy' },
    { time: '13:15 - 13:30', status: 'busy' },
    { time: '13:30 - 13:45', status: 'free' },
    { time: '13:45 - 14:00', status: 'free' },
  ],
  '2026-04-02': [
    { time: '15:00 - 15:15', status: 'busy' },
    { time: '15:15 - 15:30', status: 'free' },
    { time: '15:30 - 15:45', status: 'free' },
  ],
  '2026-04-03': [
    { time: '10:00 - 10:15', status: 'free' },
    { time: '10:15 - 10:30', status: 'free' },
    { time: '10:30 - 10:45', status: 'busy' },
  ],
}

export const availableDates = Object.keys(slotsByDate)
