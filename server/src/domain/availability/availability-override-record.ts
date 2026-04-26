export type AvailabilityOverrideRecord = {
  id: string
  startUtc: string
  endUtc: string
  isAvailable: boolean
}

export type CreateAvailabilityOverrideInput = {
  startUtc: string
  endUtc: string
  isAvailable: boolean
}

export type UpdateAvailabilityOverrideInput = {
  startUtc?: string
  endUtc?: string
  isAvailable?: boolean
}
