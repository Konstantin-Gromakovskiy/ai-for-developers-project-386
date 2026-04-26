import { Injectable } from '@nestjs/common'
import { DateTime } from 'luxon'

import type { BookingRecord } from '../../domain/bookings/booking-record'

type CreateBookingRecordInput = Omit<BookingRecord, 'id' | 'createdAt'>

@Injectable()
export class InMemoryBookingsRepository {
  private readonly bookings: BookingRecord[] = this.createSeedBookings()

  findAll() {
    return [...this.bookings]
  }

  findByEventTypeId(eventTypeId: string) {
    return this.bookings.filter((booking) => booking.eventTypeId === eventTypeId)
  }

  create(input: CreateBookingRecordInput) {
    const booking: BookingRecord = {
      id: `booking_${Math.random().toString(36).slice(2, 10)}`,
      createdAt: DateTime.utc().toISO() ?? '',
      endUtc: input.endUtc,
      eventTypeId: input.eventTypeId,
      guestEmail: input.guestEmail,
      guestName: input.guestName,
      guestNotes: input.guestNotes,
      startUtc: input.startUtc,
    }

    this.bookings.push(booking)

    return booking
  }

  hasOverlap(eventTypeId: string, startUtc: string, endUtc: string) {
    const requestedStart = new Date(startUtc).getTime()
    const requestedEnd = new Date(endUtc).getTime()

    return this.bookings.some((booking) => {
      if (booking.eventTypeId !== eventTypeId) {
        return false
      }

      const bookingStart = new Date(booking.startUtc).getTime()
      const bookingEnd = new Date(booking.endUtc).getTime()

      return requestedStart < bookingEnd && bookingStart < requestedEnd
    })
  }

  private createSeedBookings(): BookingRecord[] {
    const timezone = 'Europe/Moscow'
    const nextMondayStart = this.nextWeekdayDateTime(timezone, 1, 9, 0)
    const nextTuesdayStart = this.nextWeekdayDateTime(timezone, 2, 11, 0)

    return [
      {
        id: 'booking_seed_15',
        eventTypeId: 'evt_15_min',
        guestName: 'Демо гость',
        guestEmail: 'guest15@example.com',
        guestNotes: 'Seed booking for slot exclusion demo',
        startUtc: nextMondayStart.toUTC().toISO() ?? '',
        endUtc: nextMondayStart.plus({ minutes: 15 }).toUTC().toISO() ?? '',
        createdAt: DateTime.utc().toISO() ?? '',
      },
      {
        id: 'booking_seed_30',
        eventTypeId: 'evt_30_min',
        guestName: 'Демо гость',
        guestEmail: 'guest30@example.com',
        guestNotes: 'Seed booking for slot exclusion demo',
        startUtc: nextTuesdayStart.toUTC().toISO() ?? '',
        endUtc: nextTuesdayStart.plus({ minutes: 30 }).toUTC().toISO() ?? '',
        createdAt: DateTime.utc().toISO() ?? '',
      },
    ]
  }

  private nextWeekdayDateTime(
    timezone: string,
    targetWeekday: number,
    hour: number,
    minute: number,
  ) {
    let candidate = DateTime.now().setZone(timezone).plus({ days: 1 }).startOf('day')

    while (candidate.weekday !== targetWeekday) {
      candidate = candidate.plus({ days: 1 })
    }

    return candidate.set({ hour, minute, second: 0, millisecond: 0 })
  }
}
