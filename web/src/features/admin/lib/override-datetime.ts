import { DateTime } from 'luxon'

export function formatUtcInterval(startUtc: string, endUtc: string) {
  const start = DateTime.fromISO(startUtc, { zone: 'utc' }).toLocal()
  const end = DateTime.fromISO(endUtc, { zone: 'utc' }).toLocal()

  return `${start.toFormat('dd.LL.yyyy HH:mm')} - ${end.toFormat('dd.LL.yyyy HH:mm')}`
}

export function utcToLocalInputValue(value: string) {
  return DateTime.fromISO(value, { zone: 'utc' }).toLocal().toFormat('yyyy-LL-dd\'T\'HH:mm')
}

export function localInputValueToUtc(value: string) {
  return DateTime.fromFormat(value, 'yyyy-LL-dd\'T\'HH:mm').toUTC().toISO()
}
