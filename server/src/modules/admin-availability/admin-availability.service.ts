import { Injectable } from '@nestjs/common'
import { IANAZone } from 'luxon'

import { createValidationError } from '../../common/errors/api-errors'
import type {
  AvailabilityConfigurationRecord,
  DayOfWeek,
  ReplaceAvailabilityInput,
  WeeklyAvailabilityRuleInput,
} from '../../domain/availability/availability-configuration-record'
import { InMemoryAvailabilityRepository } from '../../infrastructure/repositories/in-memory-availability.repository'

@Injectable()
export class AdminAvailabilityService {
  private readonly dayOfWeekValues = new Set<DayOfWeek>([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ])

  constructor(
    private readonly availabilityRepository: InMemoryAvailabilityRepository,
  ) {}

  getAvailability(): AvailabilityConfigurationRecord {
    return this.availabilityRepository.getConfiguration()
  }

  replaceAvailability(input: ReplaceAvailabilityInput): AvailabilityConfigurationRecord {
    const timezone = this.normalizeTimezone(input.timezone)
    const weeklyRules = this.validateWeeklyRules(input.weeklyRules)

    return this.availabilityRepository.replaceConfiguration({
      timezone,
      weeklyRules,
    })
  }

  private normalizeTimezone(timezone: string) {
    if (typeof timezone !== 'string') {
      throw createValidationError('Availability timezone is required')
    }

    const normalizedTimezone = timezone.trim()

    if (normalizedTimezone.length === 0) {
      throw createValidationError('Availability timezone must not be empty')
    }

    if (!IANAZone.isValidZone(normalizedTimezone)) {
      throw createValidationError('Availability timezone must be a valid IANA timezone')
    }

    return normalizedTimezone
  }

  private validateWeeklyRules(weeklyRules: WeeklyAvailabilityRuleInput[]) {
    if (!Array.isArray(weeklyRules)) {
      throw createValidationError('Availability weeklyRules must be an array')
    }

    return weeklyRules.map((rule, index) => this.validateWeeklyRule(rule, index))
  }

  private validateWeeklyRule(rule: WeeklyAvailabilityRuleInput, index: number): WeeklyAvailabilityRuleInput {
    if (!rule || typeof rule !== 'object') {
      throw createValidationError(`Weekly rule at index ${index} is invalid`)
    }

    if (!this.dayOfWeekValues.has(rule.dayOfWeek)) {
      throw createValidationError(`Weekly rule at index ${index} has invalid dayOfWeek`)
    }

    this.validatePlainTime(rule.startLocalTime, `Weekly rule at index ${index} has invalid startLocalTime`)
    this.validatePlainTime(rule.endLocalTime, `Weekly rule at index ${index} has invalid endLocalTime`)

    if (this.toComparableTime(rule.endLocalTime) <= this.toComparableTime(rule.startLocalTime)) {
      throw createValidationError(`Weekly rule at index ${index} must end after it starts`)
    }

    return {
      dayOfWeek: rule.dayOfWeek,
      startLocalTime: rule.startLocalTime,
      endLocalTime: rule.endLocalTime,
    }
  }

  private validatePlainTime(value: string, message: string) {
    if (typeof value !== 'string') {
      throw createValidationError(message)
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value)) {
      throw createValidationError(message)
    }
  }

  private toComparableTime(value: string) {
    const [hours, minutes, seconds = '00'] = value.split(':')

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)
  }
}
