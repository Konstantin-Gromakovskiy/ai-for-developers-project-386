import { Injectable } from '@nestjs/common'
import { DateTime, Interval } from 'luxon'

import { createNotFoundError } from '../../common/errors/api-errors'
import type { SlotRecord } from '../../domain/bookings/booking-record'
import type { DayOfWeek } from '../../domain/availability/availability-configuration-record'
import type { AvailabilityOverrideRecord } from '../../domain/availability/availability-override-record'
import { InMemoryAvailabilityRepository } from '../../infrastructure/repositories/in-memory-availability.repository'
import { InMemoryAvailabilityOverridesRepository } from '../../infrastructure/repositories/in-memory-availability-overrides.repository'
import { InMemoryBookingsRepository } from '../../infrastructure/repositories/in-memory-bookings.repository'
import { InMemoryEventTypesRepository } from '../../infrastructure/repositories/in-memory-event-types.repository'

@Injectable()
export class PublicSlotsService {
  listEventTypeSlots(slug: string): SlotRecord[] {
    const eventType = this.eventTypesRepository.findActiveBySlug(slug)

    if (!eventType) {
      throw createNotFoundError(`Event type with slug '${slug}' was not found`)
    }

    const availability = this.availabilityRepository.getConfiguration()
    const overrides = this.availabilityOverridesRepository.findAll()
    const bookings = this.bookingsRepository.findByEventTypeId(eventType.id)

    const now = DateTime.utc()
    const windowEnd = now.plus({ days: 14 })
    const availabilityIntervals = this.buildAvailabilityIntervals(
      availability.timezone,
      availability.weeklyRules,
      overrides,
      now,
      windowEnd,
    )
    const bookingIntervals = bookings.map((booking) => (
      Interval.fromDateTimes(
        DateTime.fromISO(booking.startUtc, { zone: 'utc' }),
        DateTime.fromISO(booking.endUtc, { zone: 'utc' }),
      )
    ))

    const slots: SlotRecord[] = []

    for (const availabilityInterval of availabilityIntervals) {
      if (!availabilityInterval.start || !availabilityInterval.end) {
        continue
      }

      let slotStart = availabilityInterval.start

      while (slotStart.plus({ minutes: eventType.durationMinutes }) <= availabilityInterval.end) {
        const slotEnd = slotStart.plus({ minutes: eventType.durationMinutes })

        if (
          slotStart >= now
          && slotEnd <= windowEnd
          && !this.overlapsAnyBooking(slotStart, slotEnd, bookingIntervals)
        ) {
          slots.push({
            startUtc: slotStart.toUTC().toISO() ?? '',
            endUtc: slotEnd.toUTC().toISO() ?? '',
          })
        }

        slotStart = slotEnd
      }
    }

    return slots
  }

  constructor(
    private readonly eventTypesRepository: InMemoryEventTypesRepository,
    private readonly availabilityRepository: InMemoryAvailabilityRepository,
    private readonly availabilityOverridesRepository: InMemoryAvailabilityOverridesRepository,
    private readonly bookingsRepository: InMemoryBookingsRepository,
  ) {}

  private buildAvailabilityIntervals(
    timezone: string,
    weeklyRules: Array<{
      dayOfWeek: DayOfWeek
      startLocalTime: string
      endLocalTime: string
    }>,
    overrides: AvailabilityOverrideRecord[],
    now: DateTime,
    windowEnd: DateTime,
  ) {
    const baseIntervals: Interval[] = []
    const localStartDate = now.setZone(timezone).startOf('day')
    const localEndDate = windowEnd.setZone(timezone).startOf('day')

    let currentLocalDate = localStartDate

    while (currentLocalDate <= localEndDate) {
      const currentDayOfWeek = this.getDayOfWeek(currentLocalDate)
      const dayRules = weeklyRules.filter((rule) => rule.dayOfWeek === currentDayOfWeek)

      for (const rule of dayRules) {
        const startLocal = this.applyPlainTime(currentLocalDate, rule.startLocalTime)
        const endLocal = this.applyPlainTime(currentLocalDate, rule.endLocalTime)

        baseIntervals.push(Interval.fromDateTimes(startLocal.toUTC(), endLocal.toUTC()))
      }

      currentLocalDate = currentLocalDate.plus({ days: 1 })
    }

    let availabilityIntervals = Interval.merge(baseIntervals)

    for (const override of overrides) {
      const overrideInterval = Interval.fromDateTimes(
        DateTime.fromISO(override.startUtc, { zone: 'utc' }),
        DateTime.fromISO(override.endUtc, { zone: 'utc' }),
      )

      availabilityIntervals = override.isAvailable
        ? Interval.merge([...availabilityIntervals, overrideInterval])
        : this.subtractInterval(availabilityIntervals, overrideInterval)
    }

    return availabilityIntervals.filter(
      (interval: Interval) => Boolean(interval.start && interval.end && interval.end > now && interval.start < windowEnd),
    )
  }

  private subtractInterval(sourceIntervals: Interval[], subtraction: Interval) {
    const remainingIntervals: Interval[] = []

    for (const source of sourceIntervals) {
      if (!source.start || !source.end || !subtraction.start || !subtraction.end) {
        continue
      }

      if (!source.overlaps(subtraction)) {
        remainingIntervals.push(source)
        continue
      }

      if (subtraction.start > source.start) {
        remainingIntervals.push(Interval.fromDateTimes(source.start, subtraction.start))
      }

      if (subtraction.end < source.end) {
        remainingIntervals.push(Interval.fromDateTimes(subtraction.end, source.end))
      }
    }

    return remainingIntervals.filter((interval) => interval.isValid && interval.length('milliseconds') > 0)
  }

  private overlapsAnyBooking(start: DateTime, end: DateTime, bookings: Interval[]) {
    return bookings.some((booking) => {
      if (!booking.start || !booking.end) {
        return false
      }

      return start < booking.end && booking.start < end
    })
  }

  private getDayOfWeek(value: DateTime): DayOfWeek {
    switch (value.weekday) {
      case 1:
        return 'monday'
      case 2:
        return 'tuesday'
      case 3:
        return 'wednesday'
      case 4:
        return 'thursday'
      case 5:
        return 'friday'
      case 6:
        return 'saturday'
      default:
        return 'sunday'
    }
  }

  private applyPlainTime(date: DateTime, plainTime: string) {
    const [hours, minutes, seconds = '00'] = plainTime.split(':')

    return date.set({
      hour: Number(hours),
      minute: Number(minutes),
      second: Number(seconds),
      millisecond: 0,
    })
  }
}
