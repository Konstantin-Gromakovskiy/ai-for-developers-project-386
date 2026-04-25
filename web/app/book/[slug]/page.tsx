'use client'

import 'dayjs/locale/ru'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { use, useMemo, useState } from 'react'

import {
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'

import {
  getEventTypeOption,
  hostProfile,
} from '@/src/entities/event-type/model/event-types'
import { HostSummary } from '@/src/entities/event-type/ui/host-summary'
import { formatSelectedDate } from '@/src/features/booking/lib/format-booking'
import {
  availableDates,
  defaultBookingMonth,
  defaultSelectedDate,
  slotsByDate,
} from '@/src/features/booking/model/booking-mocks'
import { SelectionInfoCard } from '@/src/features/booking/ui/selection-info-card'
import { SlotRow } from '@/src/features/booking/ui/slot-row'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type BookPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default function BookPage({ params }: BookPageProps) {
  const { slug } = use(params)
  const router = useRouter()
  const t = useTranslations('BookPage')
  const tGuest = useTranslations('GuestPage')
  const tCommon = useTranslations('Common')
  const eventType = getEventTypeOption(slug)
  const eventTypeLabel = eventType
    ? tGuest(`eventTypes.${eventType.messageKey}.title`)
    : slug
  const eventTypeDescription = eventType
    ? tGuest(`eventTypes.${eventType.messageKey}.description`)
    : t('fallbackDescription')
  const eventTypeDuration = eventType
    ? tGuest(`eventTypes.${eventType.messageKey}.duration`)
    : t('fallbackDuration')

  const [calendarDate, setCalendarDate] = useState(defaultBookingMonth)
  const [selectedDate, setSelectedDate] = useState<string | null>(defaultSelectedDate)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const slots = useMemo(() => {
    if (!selectedDate) {
      return []
    }

    return slotsByDate[selectedDate] ?? []
  }, [selectedDate])

  const selectedDateLabel = selectedDate
    ? formatSelectedDate(selectedDate)
    : t('noDate')

  const continueDisabled = !selectedDate || !selectedTime

  function handleDateChange(value: string | null) {
    setSelectedDate(value)
    setSelectedTime(null)
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) {
      return
    }

    const searchParams = new URLSearchParams({
      date: selectedDate,
      time: selectedTime,
    })

    router.push(`/book/${slug}/details?${searchParams.toString()}`)
  }

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 48 }} size="xl">
        <Stack gap="xl">
          <Title c="ink.9" order={1}>
            {eventTypeLabel}
          </Title>

          <Grid gap="md">
            <Grid.Col span={{ base: 12, md: 4, lg: 3 }}>
              <Card h="100%">
                <Stack gap="xl">
                  <HostSummary name={hostProfile.name} role={tGuest('hostRole')} />

                  <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                      <Title c="ink.9" order={2}>
                        {eventTypeLabel}
                      </Title>
                      <Badge color="mist">{eventTypeDuration}</Badge>
                    </Group>

                    <Text c="ink.5" fz="lg" lh={1.55}>
                      {eventTypeDescription}
                    </Text>
                  </Stack>

                  <SelectionInfoCard
                    label={t('selectedDateLabel')}
                    value={selectedDateLabel}
                  />

                  <SelectionInfoCard
                    label={t('selectedTimeLabel')}
                    value={selectedTime ?? t('noTime')}
                  />
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8, lg: 5 }}>
              <Card>
                <Stack gap="lg">
                  <Title c="ink.9" order={2}>
                    {t('calendarTitle')}
                  </Title>

                  <DatePicker
                    allowDeselect={false}
                    ariaLabels={{
                      nextMonth: t('nextMonth'),
                      previousMonth: t('previousMonth'),
                    }}
                    date={calendarDate}
                    defaultDate={defaultBookingMonth}
                    excludeDate={date => !availableDates.includes(date)}
                    firstDayOfWeek={1}
                    fullWidth
                    headerControlsOrder={['level', 'previous', 'next']}
                    locale="ru"
                    maxDate="2026-04-03"
                    minDate="2026-03-30"
                    monthLabelFormat="MMMM YYYY [г.]"
                    onChange={handleDateChange}
                    onDateChange={setCalendarDate}
                    styles={{
                      calendarHeader: {
                        marginBottom: '10px',
                      },
                      calendarHeaderControl: {
                        borderRadius: '14px',
                        border: '1px solid var(--mantine-color-mist-2)',
                      },
                      calendarHeaderLevel: {
                        color: 'var(--mantine-color-ink-9)',
                        fontSize: '16px',
                        fontWeight: 600,
                        justifyContent: 'flex-start',
                      },
                      day: {
                        borderRadius: '12px',
                        fontWeight: 500,
                        height: '44px',
                        width: '44px',
                      },
                      weekday: {
                        color: 'var(--mantine-color-ink-5)',
                        fontSize: '14px',
                        fontWeight: 600,
                      },
                    }}
                    value={selectedDate}
                  />
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 12, lg: 4 }}>
              <Card h="100%">
                <Stack gap="lg" h="100%" justify="space-between">
                  <Stack gap="md">
                    <Title c="ink.9" order={2}>
                      {t('slotsTitle')}
                    </Title>

                    <Stack gap="sm">
                      {slots.map(slot => (
                        <SlotRow
                          key={slot.time}
                          onSelect={() => setSelectedTime(slot.time)}
                          selected={selectedTime === slot.time}
                          status={slot.status}
                          statusLabel={slot.status === 'free' ? tCommon('free') : tCommon('busy')}
                          time={slot.time}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  <Group grow>
                    <Link href="/guest" style={{ display: 'block', textDecoration: 'none' }}>
                      <Button color="ink" fullWidth variant="white">
                        {t('back')}
                      </Button>
                    </Link>
                    <Button color="accent" disabled={continueDisabled} fullWidth onClick={handleContinue}>
                      {t('continue')}
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
