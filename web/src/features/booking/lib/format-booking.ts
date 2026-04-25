const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function formatSelectedDate(date: string | null) {
  if (!date) {
    return ''
  }

  return fullDateFormatter.format(new Date(`${date}T12:00:00Z`))
}
