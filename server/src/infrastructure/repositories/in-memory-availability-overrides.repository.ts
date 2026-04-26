import { Injectable } from '@nestjs/common'

import type {
  AvailabilityOverrideRecord,
  CreateAvailabilityOverrideInput,
  UpdateAvailabilityOverrideInput,
} from '../../domain/availability/availability-override-record'

@Injectable()
export class InMemoryAvailabilityOverridesRepository {
  private readonly overrides: AvailabilityOverrideRecord[] = [
    {
      id: 'override_block_1',
      startUtc: '2026-05-01T09:00:00.000Z',
      endUtc: '2026-05-01T12:00:00.000Z',
      isAvailable: false,
    },
    {
      id: 'override_open_1',
      startUtc: '2026-05-03T14:00:00.000Z',
      endUtc: '2026-05-03T16:00:00.000Z',
      isAvailable: true,
    },
  ]

  findAll() {
    return [...this.overrides]
  }

  findById(id: string) {
    return this.overrides.find(override => override.id === id) ?? null
  }

  create(input: CreateAvailabilityOverrideInput) {
    const availabilityOverride: AvailabilityOverrideRecord = {
      id: this.generateId(),
      startUtc: input.startUtc,
      endUtc: input.endUtc,
      isAvailable: input.isAvailable,
    }

    this.overrides.push(availabilityOverride)

    return availabilityOverride
  }

  update(id: string, patch: UpdateAvailabilityOverrideInput) {
    const availabilityOverride = this.findById(id)

    if (!availabilityOverride) {
      return null
    }

    Object.assign(availabilityOverride, patch)

    return availabilityOverride
  }

  delete(id: string) {
    const index = this.overrides.findIndex(override => override.id === id)

    if (index === -1) {
      return false
    }

    this.overrides.splice(index, 1)

    return true
  }

  private generateId() {
    return `override_${Math.random().toString(36).slice(2, 10)}`
  }
}
