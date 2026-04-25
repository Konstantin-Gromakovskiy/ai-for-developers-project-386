'use client'

import 'dayjs/locale/ru'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { use, useMemo, useState } from 'react'

import {
  Alert,
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

import { hostProfile } from '@/src/entities/event-type/model/event-types'
import { HostSummary } from '@/src/entities/event-type/ui/host-summary'
import {
  formatSelectedDate,
  formatSlotTimeRange,
  getLocalDateFromUtc,
  getMonthValueFromDate,
} from '@/src/features/booking/lib/format-booking'
import { SelectionInfoCard } from '@/src/features/booking/ui/selection-info-card'
import { SlotRow } from '@/src/features/booking/ui/slot-row'
import { getPublicEventType, listEventTypeSlots } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
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

  const eventTypeQuery = useQuery({
    queryKey: queryKeys.publicEventType(slug),
    queryFn: () => getPublicEventType(slug),
  })

  const slotsQuery = useQuery({
    queryKey: queryKeys.eventTypeSlots(slug),
    queryFn: () => listEventTypeSlots(slug),
  })

  const groupedSlots = useMemo(() => {
    const slotGroups: Record<string, Array<{ id: string, label: string }>> = {}

    for (const slot of slotsQuery.data ?? []) {
      const localDate = getLocalDateFromUtc(slot.startUtc)

      if (!localDate) {
        continue
      }

      const slotItem = {
        id: slot.startUtc,
        label: formatSlotTimeRange(slot.startUtc, slot.endUtc),
      }

      if (!slotGroups[localDate]) {
        slotGroups[localDate] = [slotItem]
        continue
      }

      slotGroups[localDate].push(slotItem)
    }

    return slotGroups
  }, [slotsQuery.data])

  const availableDates = useMemo(
    () => Object.keys(groupedSlots).sort((left, right) => left.localeCompare(right)),
    [groupedSlots],
  )

  const [calendarDate, setCalendarDate] = useState<string | null>(null)
  const [selectedDateState, setSelectedDateState] = useState<string | null>(null)
  const [selectedTimeState, setSelectedTimeState] = useState<string | null>(null)

  const selectedDate
    = selectedDateState && availableDates.includes(selectedDateState)
      ? selectedDateState
      : availableDates[0] ?? null

  const slots = selectedDate ? groupedSlots[selectedDate] ?? [] : []

  const selectedSlot = selectedTimeState
    ? slots.find(slot => slot.id === selectedTimeState) ?? null
    : null

  const selectedDateLabel = selectedDate ? formatSelectedDate(selectedDate) : t('noDate')

  const eventTypeLabel = eventTypeQuery.data?.title ?? slug
  const eventTypeDescription = eventTypeQuery.data?.description ?? t('fallbackDescription')
  const eventTypeDuration = eventTypeQuery.data
    ? t('duration', { minutes: eventTypeQuery.data.durationMinutes })
    : t('fallbackDuration')

  const visibleCalendarDate = calendarDate
    ?? (selectedDate ? getMonthValueFromDate(selectedDate) : null)
    ?? availableDates[0]
    ?? null

  const continueDisabled = !selectedDate || !selectedSlot

  function handleDateChange(value: string | null) {
    setSelectedDateState(value)
    setSelectedTimeState(null)

    if (value) {
      setCalendarDate(getMonthValueFromDate(value))
    }
  }

  function handleContinue() {
    if (!selectedDate || !selectedSlot) {
      return
    }

    const searchParams = new URLSearchParams({
      date: selectedDate,
      time: selectedSlot.label,
    })

    router.push(`/book/${slug}/details?${searchParams.toString()}`)
  }

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 48 }} size="xl">
        <Stack gap="xl">
          {eventTypeQuery.isError || slotsQuery.isError
            ? (
                <Alert color="red" title={t('errors.loadBookingTitle')} variant="light">
                  {t('errors.loadBookingDescription')}
                </Alert>
              )
            : null}

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
                    value={selectedSlot?.label ?? t('noTime')}
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
                    date={visibleCalendarDate}
                    defaultDate={visibleCalendarDate ?? undefined}
                    excludeDate={date => !availableDates.includes(date)}
                    firstDayOfWeek={1}
                    fullWidth
                    headerControlsOrder={['level', 'previous', 'next']}
                    locale="ru"
                    maxDate={availableDates.at(-1)}
                    minDate={availableDates[0]}
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
                      {slots.length === 0 && !slotsQuery.isPending
                        ? (
                            <Text c="ink.5" fz="lg">
                              {t('noSlots')}
                            </Text>
                          )
                        : null}

                      {slots.map(slot => (
                        <SlotRow
                          key={slot.id}
                          onSelect={() => setSelectedTimeState(slot.id)}
                          selected={selectedSlot?.id === slot.id}
                          status="free"
                          statusLabel={tCommon('free')}
                          time={slot.label}
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
