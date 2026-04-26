export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type WeeklyAvailabilityRuleRecord = {
  id: string
  dayOfWeek: DayOfWeek
  startLocalTime: string
  endLocalTime: string
}

export type AvailabilityConfigurationRecord = {
  timezone: string
  weeklyRules: WeeklyAvailabilityRuleRecord[]
}

export type WeeklyAvailabilityRuleInput = {
  dayOfWeek: DayOfWeek
  startLocalTime: string
  endLocalTime: string
}

export type ReplaceAvailabilityInput = {
  timezone: string
  weeklyRules: WeeklyAvailabilityRuleInput[]
}
