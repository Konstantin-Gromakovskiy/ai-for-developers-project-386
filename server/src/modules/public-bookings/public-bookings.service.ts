import { Injectable } from '@nestjs/common'

import {
  createConflictError,
  createNotFoundError,
  createValidationError,
} from '../../common/errors/api-errors'
import { InMemoryBookingsRepository } from '../../infrastructure/repositories/in-memory-bookings.repository'
import { InMemoryEventTypesRepository } from '../../infrastructure/repositories/in-memory-event-types.repository'
import { PublicSlotsService } from '../public-slots/public-slots.service'

type CreateBookingInput = {
  startUtc: string
  guestName: string
  guestEmail: string
  guestNotes?: string
}

@Injectable()
export class PublicBookingsService {
  constructor(
    private readonly eventTypesRepository: InMemoryEventTypesRepository,
    private readonly bookingsRepository: InMemoryBookingsRepository,
    private readonly publicSlotsService: PublicSlotsService,
  ) {}

  createBooking(slug: string, input: CreateBookingInput) {
    const eventType = this.eventTypesRepository.findActiveBySlug(slug)

    if (!eventType) {
      throw createNotFoundError(`Event type with slug '${slug}' was not found`)
    }

    const normalizedInput = this.validateInput(input)
    const availableSlot = this.publicSlotsService
      .listEventTypeSlots(slug)
      .find((slot) => slot.startUtc === normalizedInput.startUtc)

    if (!availableSlot) {
      throw createValidationError('Selected slot is not available')
    }

    if (this.bookingsRepository.hasOverlap(eventType.id, availableSlot.startUtc, availableSlot.endUtc)) {
      throw createConflictError('Selected slot is already booked')
    }

    return this.bookingsRepository.create({
      endUtc: availableSlot.endUtc,
      eventTypeId: eventType.id,
      guestEmail: normalizedInput.guestEmail,
      guestName: normalizedInput.guestName,
      guestNotes: normalizedInput.guestNotes,
      startUtc: availableSlot.startUtc,
    })
  }

  private validateInput(input: CreateBookingInput) {
    const guestName = this.normalizeGuestName(input.guestName)
    const guestEmail = this.normalizeGuestEmail(input.guestEmail)
    const guestNotes = this.normalizeGuestNotes(input.guestNotes)
    const startUtc = this.normalizeStartUtc(input.startUtc)

    return {
      guestEmail,
      guestName,
      guestNotes,
      startUtc,
    }
  }

  private normalizeGuestName(guestName: string) {
    if (typeof guestName !== 'string') {
      throw createValidationError('Guest name is required')
    }

    const normalizedGuestName = guestName.trim()

    if (normalizedGuestName.length === 0) {
      throw createValidationError('Guest name must not be empty')
    }

    return normalizedGuestName
  }

  private normalizeGuestEmail(guestEmail: string) {
    if (typeof guestEmail !== 'string') {
      throw createValidationError('Guest email is required')
    }

    const normalizedGuestEmail = guestEmail.trim().toLowerCase()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedGuestEmail)) {
      throw createValidationError('Guest email must be a valid email address')
    }

    return normalizedGuestEmail
  }

  private normalizeGuestNotes(guestNotes?: string) {
    if (typeof guestNotes === 'undefined') {
      return undefined
    }

    if (typeof guestNotes !== 'string') {
      throw createValidationError('Guest notes must be a string')
    }

    const normalizedGuestNotes = guestNotes.trim()

    return normalizedGuestNotes.length > 0 ? normalizedGuestNotes : undefined
  }

  private normalizeStartUtc(startUtc: string) {
    if (typeof startUtc !== 'string') {
      throw createValidationError('Booking startUtc is required')
    }

    const parsedDate = new Date(startUtc)

    if (Number.isNaN(parsedDate.getTime())) {
      throw createValidationError('Booking startUtc must be a valid UTC date-time string')
    }

    return parsedDate.toISOString()
  }
}
