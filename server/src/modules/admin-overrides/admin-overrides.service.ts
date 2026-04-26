import { Injectable } from '@nestjs/common'

import {
  createNotFoundError,
  createValidationError,
} from '../../common/errors/api-errors'
import type {
  AvailabilityOverrideRecord,
  CreateAvailabilityOverrideInput,
  UpdateAvailabilityOverrideInput,
} from '../../domain/availability/availability-override-record'
import { InMemoryAvailabilityOverridesRepository } from '../../infrastructure/repositories/in-memory-availability-overrides.repository'

@Injectable()
export class AdminOverridesService {
  constructor(
    private readonly availabilityOverridesRepository: InMemoryAvailabilityOverridesRepository,
  ) {}

  listAvailabilityOverrides(): AvailabilityOverrideRecord[] {
    return this.availabilityOverridesRepository.findAll()
  }

  createAvailabilityOverride(input: CreateAvailabilityOverrideInput) {
    const normalizedInput = this.validateCreateInput(input)

    return this.availabilityOverridesRepository.create(normalizedInput)
  }

  updateAvailabilityOverride(id: string, input: UpdateAvailabilityOverrideInput) {
    const existingOverride = this.availabilityOverridesRepository.findById(id)

    if (!existingOverride) {
      throw createNotFoundError(`Availability override with id '${id}' was not found`)
    }

    const normalizedPatch = this.validateUpdateInput(existingOverride, input)

    return this.availabilityOverridesRepository.update(id, normalizedPatch)
  }

  deleteAvailabilityOverride(id: string) {
    const deleted = this.availabilityOverridesRepository.delete(id)

    if (!deleted) {
      throw createNotFoundError(`Availability override with id '${id}' was not found`)
    }
  }

  private validateCreateInput(input: CreateAvailabilityOverrideInput): CreateAvailabilityOverrideInput {
    this.validateBoolean(input.isAvailable)

    return this.validateUtcInterval({
      endUtc: input.endUtc,
      isAvailable: input.isAvailable,
      startUtc: input.startUtc,
    })
  }

  private validateUpdateInput(
    currentValue: AvailabilityOverrideRecord,
    input: UpdateAvailabilityOverrideInput,
  ): UpdateAvailabilityOverrideInput {
    if (
      typeof input.startUtc === 'undefined'
      && typeof input.endUtc === 'undefined'
      && typeof input.isAvailable === 'undefined'
    ) {
      throw createValidationError('Availability override update payload is empty')
    }

    if (typeof input.isAvailable !== 'undefined') {
      this.validateBoolean(input.isAvailable)
    }

    const nextValue = this.validateUtcInterval({
      endUtc: input.endUtc ?? currentValue.endUtc,
      isAvailable: input.isAvailable ?? currentValue.isAvailable,
      startUtc: input.startUtc ?? currentValue.startUtc,
    })

    return {
      endUtc: nextValue.endUtc,
      isAvailable: nextValue.isAvailable,
      startUtc: nextValue.startUtc,
    }
  }

  private validateBoolean(value: boolean) {
    if (typeof value !== 'boolean') {
      throw createValidationError('Availability override isAvailable must be a boolean')
    }
  }

  private validateUtcInterval(input: CreateAvailabilityOverrideInput): CreateAvailabilityOverrideInput {
    const startUtcDate = this.parseUtcDateTime(
      input.startUtc,
      'Availability override startUtc must be a valid UTC date-time string',
    )
    const endUtcDate = this.parseUtcDateTime(
      input.endUtc,
      'Availability override endUtc must be a valid UTC date-time string',
    )

    if (endUtcDate.getTime() <= startUtcDate.getTime()) {
      throw createValidationError('Availability override endUtc must be later than startUtc')
    }

    return input
  }

  private parseUtcDateTime(value: string, errorMessage: string) {
    if (typeof value !== 'string') {
      throw createValidationError(errorMessage)
    }

    const parsedDate = new Date(value)

    if (Number.isNaN(parsedDate.getTime())) {
      throw createValidationError(errorMessage)
    }

    return parsedDate
  }
}
