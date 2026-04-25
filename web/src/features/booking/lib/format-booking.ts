import { DateTime } from 'luxon'

export function formatSelectedDate(date: string | null) {
  if (!date) {
    return ''
  }

  return DateTime.fromISO(date).setLocale('ru').toFormat('cccc, d LLLL')
}

export function getLocalDateFromUtc(utcDateTime: string) {
  return DateTime.fromISO(utcDateTime, { zone: 'utc' }).toLocal().toISODate()
}

export function getMonthValueFromDate(date: string) {
  return DateTime.fromISO(date).startOf('month').toISODate() ?? date
}

export function formatSlotTimeRange(startUtc: string, endUtc: string) {
  const start = DateTime.fromISO(startUtc, { zone: 'utc' }).toLocal()
  const end = DateTime.fromISO(endUtc, { zone: 'utc' }).toLocal()

  return `${start.toFormat('HH:mm')} - ${end.toFormat('HH:mm')}`
}
