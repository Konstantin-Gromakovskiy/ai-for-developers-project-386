import { Injectable } from '@nestjs/common'

import type {
  AvailabilityConfigurationRecord,
  ReplaceAvailabilityInput,
  WeeklyAvailabilityRuleRecord,
} from '../../domain/availability/availability-configuration-record'

@Injectable()
export class InMemoryAvailabilityRepository {
  private configuration: AvailabilityConfigurationRecord = {
    timezone: 'Europe/Moscow',
    weeklyRules: [
      {
        id: 'avail_mon_1',
        dayOfWeek: 'monday',
        startLocalTime: '09:00',
        endLocalTime: '18:00',
      },
      {
        id: 'avail_tue_1',
        dayOfWeek: 'tuesday',
        startLocalTime: '09:00',
        endLocalTime: '18:00',
      },
      {
        id: 'avail_wed_1',
        dayOfWeek: 'wednesday',
        startLocalTime: '10:00',
        endLocalTime: '17:00',
      },
    ],
  }

  getConfiguration() {
    return this.cloneConfiguration(this.configuration)
  }

  replaceConfiguration(input: ReplaceAvailabilityInput) {
    this.configuration = {
      timezone: input.timezone,
      weeklyRules: input.weeklyRules.map((rule, index) => ({
        id: this.generateRuleId(rule.dayOfWeek, index),
        dayOfWeek: rule.dayOfWeek,
        startLocalTime: rule.startLocalTime,
        endLocalTime: rule.endLocalTime,
      })),
    }

    return this.getConfiguration()
  }

  private cloneConfiguration(configuration: AvailabilityConfigurationRecord): AvailabilityConfigurationRecord {
    return {
      timezone: configuration.timezone,
      weeklyRules: configuration.weeklyRules.map((rule) => ({
        id: rule.id,
        dayOfWeek: rule.dayOfWeek,
        startLocalTime: rule.startLocalTime,
        endLocalTime: rule.endLocalTime,
      })),
    }
  }

  private generateRuleId(dayOfWeek: WeeklyAvailabilityRuleRecord['dayOfWeek'], index: number) {
    return `avail_${dayOfWeek}_${index + 1}_${Math.random().toString(36).slice(2, 8)}`
  }
}
