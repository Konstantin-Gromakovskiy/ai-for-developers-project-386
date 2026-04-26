import { Injectable } from '@nestjs/common'

import type {
  EventTypeRecord,
  PublicEventType,
} from '../../domain/event-types/event-type-record'
import { createNotFoundError } from '../../common/errors/api-errors'
import { InMemoryEventTypesRepository } from '../../infrastructure/repositories/in-memory-event-types.repository'

@Injectable()
export class PublicEventTypesService {
  constructor(
    private readonly eventTypesRepository: InMemoryEventTypesRepository,
  ) {}

  listPublicEventTypes(): PublicEventType[] {
    return this.eventTypesRepository
      .findActivePublicEventTypes()
      .map(eventType => this.toPublicEventType(eventType))
  }

  getPublicEventType(slug: string): PublicEventType {
    const eventType = this.eventTypesRepository.findActiveBySlug(slug)

    if (!eventType) {
      throw createNotFoundError(`Event type with slug '${slug}' was not found`)
    }

    return this.toPublicEventType(eventType)
  }

  private toPublicEventType(eventType: EventTypeRecord): PublicEventType {
    return {
      slug: eventType.slug,
      title: eventType.title,
      description: eventType.description,
      durationMinutes: eventType.durationMinutes,
    }
  }
}
