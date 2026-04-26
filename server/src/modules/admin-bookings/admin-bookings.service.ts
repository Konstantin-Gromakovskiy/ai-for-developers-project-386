import { Injectable } from '@nestjs/common'

import type { BookingRecord } from '../../domain/bookings/booking-record'
import { InMemoryBookingsRepository } from '../../infrastructure/repositories/in-memory-bookings.repository'

@Injectable()
export class AdminBookingsService {
  constructor(
    private readonly bookingsRepository: InMemoryBookingsRepository,
  ) {}

  listAdminBookings(): BookingRecord[] {
    return this.bookingsRepository
      .findAll()
      .sort((left, right) => left.startUtc.localeCompare(right.startUtc))
  }
}
