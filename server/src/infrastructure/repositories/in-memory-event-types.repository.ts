import { Injectable } from '@nestjs/common'

import type { EventTypeRecord } from '../../domain/event-types/event-type-record'

@Injectable()
export class InMemoryEventTypesRepository {
  private readonly eventTypes: EventTypeRecord[] = [
    {
      id: 'evt_15_min',
      slug: '15-min',
      title: 'Встреча 15 минут',
      description: 'Короткий тип события для быстрого слота.',
      durationMinutes: 15,
      isActive: true,
      createdAt: '2026-01-01T09:00:00.000Z',
      updatedAt: '2026-01-01T09:00:00.000Z',
    },
    {
      id: 'evt_30_min',
      slug: '30-min',
      title: 'Встреча 30 минут',
      description: 'Базовый тип события для полноценного бронирования.',
      durationMinutes: 30,
      isActive: true,
      createdAt: '2026-01-01T09:15:00.000Z',
      updatedAt: '2026-01-01T09:15:00.000Z',
    },
    {
      id: 'evt_archived',
      slug: 'archived-demo',
      title: 'Архивный тип события',
      description: 'Неактивный тип события, который не должен попадать в public API.',
      durationMinutes: 45,
      isActive: false,
      createdAt: '2026-01-01T09:30:00.000Z',
      updatedAt: '2026-01-01T09:30:00.000Z',
    },
  ]

  findActivePublicEventTypes() {
    return this.eventTypes.filter(eventType => eventType.isActive)
  }

  findActiveBySlug(slug: string) {
    return this.eventTypes.find(eventType => eventType.isActive && eventType.slug === slug) ?? null
  }
}
