import { Injectable } from '@nestjs/common'

import {
  createConflictError,
  createNotFoundError,
  createValidationError,
} from '../../common/errors/api-errors'
import type { EventTypeRecord } from '../../domain/event-types/event-type-record'
import { InMemoryEventTypesRepository } from '../../infrastructure/repositories/in-memory-event-types.repository'

type CreateEventTypeInput = {
  title: string
  description?: string
  durationMinutes: number
  isActive?: boolean
}

type UpdateEventTypeInput = {
  title?: string
  description?: string
  durationMinutes?: number
  isActive?: boolean
}

@Injectable()
export class AdminEventTypesService {
  private readonly transliterationMap: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  }

  constructor(
    private readonly eventTypesRepository: InMemoryEventTypesRepository,
  ) {}

  listAdminEventTypes() {
    return this.eventTypesRepository.findAll()
  }

  createEventType(input: CreateEventTypeInput) {
    const normalizedTitle = this.normalizeTitle(input.title)
    const normalizedDescription = this.normalizeDescription(input.description)

    this.validateDuration(input.durationMinutes)

    const slug = this.slugify(normalizedTitle)

    if (this.eventTypesRepository.findBySlug(slug)) {
      throw createConflictError(`Event type with slug '${slug}' already exists`)
    }

    const now = new Date().toISOString()
    const eventType: EventTypeRecord = {
      id: this.generateId(),
      slug,
      title: normalizedTitle,
      description: normalizedDescription,
      durationMinutes: input.durationMinutes,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }

    return this.eventTypesRepository.create(eventType)
  }

  updateEventType(id: string, input: UpdateEventTypeInput) {
    const existingEventType = this.eventTypesRepository.findById(id)

    if (!existingEventType) {
      throw createNotFoundError(`Event type with id '${id}' was not found`)
    }

    const patch: Partial<EventTypeRecord> = {
      updatedAt: new Date().toISOString(),
    }

    if (typeof input.title !== 'undefined') {
      patch.title = this.normalizeTitle(input.title)
    }

    if (typeof input.description !== 'undefined') {
      patch.description = this.normalizeDescription(input.description)
    }

    if (typeof input.durationMinutes !== 'undefined') {
      this.validateDuration(input.durationMinutes)
      patch.durationMinutes = input.durationMinutes
    }

    if (typeof input.isActive !== 'undefined') {
      patch.isActive = input.isActive
    }

    return this.eventTypesRepository.update(id, patch)
  }

  deleteEventType(id: string) {
    const deleted = this.eventTypesRepository.delete(id)

    if (!deleted) {
      throw createNotFoundError(`Event type with id '${id}' was not found`)
    }
  }

  private normalizeTitle(title: string) {
    if (typeof title !== 'string') {
      throw createValidationError('Event type title is required')
    }

    const normalizedTitle = title.trim()

    if (normalizedTitle.length === 0) {
      throw createValidationError('Event type title must not be empty')
    }

    if (normalizedTitle.length > 120) {
      throw createValidationError('Event type title must be at most 120 characters long')
    }

    return normalizedTitle
  }

  private normalizeDescription(description?: string) {
    if (typeof description === 'undefined') {
      return undefined
    }

    if (typeof description !== 'string') {
      throw createValidationError('Event type description must be a string')
    }

    const normalizedDescription = description.trim()

    if (normalizedDescription.length > 2000) {
      throw createValidationError('Event type description must be at most 2000 characters long')
    }

    return normalizedDescription.length > 0 ? normalizedDescription : undefined
  }

  private validateDuration(durationMinutes: number) {
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      throw createValidationError('Event type durationMinutes must be an integer greater than or equal to 1')
    }
  }

  private slugify(value: string) {
    const transliteratedValue = value
      .toLowerCase()
      .split('')
      .map((character) => this.transliterationMap[character] ?? character)
      .join('')

    const slug = transliteratedValue
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    if (slug.length === 0) {
      throw createValidationError('Event type title cannot be converted to slug')
    }

    return slug
  }

  private generateId() {
    return `evt_${Math.random().toString(36).slice(2, 10)}`
  }
}
