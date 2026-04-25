'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Alert, Button, Card, Container, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core'
import { DateTime } from 'luxon'

import { listAdminBookings, listAdminEventTypes } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'
import { BookingItemCard } from '@/src/features/admin/ui/booking-item-card'

function formatDateLabel(value: string) {
  return DateTime.fromISO(value, { zone: 'utc' }).toLocal().setLocale('ru').toFormat('d LLLL yyyy')
}

function formatTimeLabel(startUtc: string, endUtc: string) {
  const start = DateTime.fromISO(startUtc, { zone: 'utc' }).toLocal()
  const end = DateTime.fromISO(endUtc, { zone: 'utc' }).toLocal()

  return `${start.toFormat('HH:mm')} - ${end.toFormat('HH:mm')}`
}

function formatCreatedAtLabel(value: string) {
  return DateTime.fromISO(value, { zone: 'utc' }).toLocal().setLocale('ru').toFormat('d LLLL yyyy, HH:mm')
}

export default function AdminBookingsPage() {
  const t = useTranslations('AdminPages.bookings')

  const bookingsQuery = useQuery({
    queryKey: queryKeys.adminBookings,
    queryFn: listAdminBookings,
  })

  const eventTypesQuery = useQuery({
    queryKey: queryKeys.adminEventTypes,
    queryFn: listAdminEventTypes,
  })

  const eventTypeTitles = new Map(
    (eventTypesQuery.data ?? []).map(eventType => [eventType.id, eventType.title]),
  )

  const bookings = [...(bookingsQuery.data ?? [])].sort((left, right) => left.startUtc.localeCompare(right.startUtc))

  return (
    <PublicPageShell activeSection="owner" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="xl">
        <Stack gap="xl">
          <Card>
            <Stack gap="lg">
              <Stack gap="sm">
                <Text c="ink.4" fw={700} size="sm" tt="uppercase">
                  {t('badge')}
                </Text>
                <Title c="ink.9" order={1}>
                  {t('title')}
                </Title>
                <Text c="ink.5" fz="lg" lh={1.6} maw={760}>
                  {t('description')}
                </Text>
              </Stack>

              <div>
                <Link href="/owner" style={{ textDecoration: 'none' }}>
                  <Button color="ink" variant="light">
                    {t('back')}
                  </Button>
                </Link>
              </div>
            </Stack>
          </Card>

          {bookingsQuery.isError || eventTypesQuery.isError
            ? (
                <Alert color="red" title={t('errors.loadTitle')} variant="light">
                  {t('errors.loadDescription')}
                </Alert>
              )
            : null}

          <Card>
            <Stack gap="lg">
              <Stack gap="sm">
                <Title c="ink.9" order={2}>
                  {t('list.title')}
                </Title>
                <Text c="ink.5" fz="lg" lh={1.55}>
                  {t('list.description')}
                </Text>
              </Stack>

              {bookingsQuery.isPending || eventTypesQuery.isPending
                ? (
                    <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md" verticalSpacing="md">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index}>
                          <Stack gap="sm">
                            <Skeleton height={28} radius="md" width="50%" />
                            <Skeleton height={18} radius="md" width="40%" />
                            <Skeleton height={18} radius="md" width="80%" />
                            <Skeleton height={18} radius="md" width="75%" />
                            <Skeleton height={18} radius="md" width="60%" />
                          </Stack>
                        </Card>
                      ))}
                    </SimpleGrid>
                  )
                : null}

              {!bookingsQuery.isPending && !eventTypesQuery.isPending && bookings.length === 0
                ? (
                    <Text c="ink.5" fz="lg">
                      {t('list.empty')}
                    </Text>
                  )
                : null}

              <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md" verticalSpacing="md">
                {bookings.map(booking => (
                  <BookingItemCard
                    createdAtLabel={t('fields.createdAt', {
                      value: formatCreatedAtLabel(booking.createdAt),
                    })}
                    dateLabel={t('fields.date', {
                      value: formatDateLabel(booking.startUtc),
                    })}
                    emailLabel={t('fields.email', {
                      value: booking.guestEmail,
                    })}
                    eventTypeLabel={t('fields.eventType', {
                      value: eventTypeTitles.get(booking.eventTypeId) ?? booking.eventTypeId,
                    })}
                    guestEmail={booking.guestEmail}
                    guestName={booking.guestName}
                    guestNotes={booking.guestNotes}
                    guestNotesLabel={t('fields.notes')}
                    key={booking.id}
                    statusLabel={t('status.upcoming')}
                    timeLabel={t('fields.time', {
                      value: formatTimeLabel(booking.startUtc, booking.endUtc),
                    })}
                    title={t('fields.notesTitle')}
                  />
                ))}
              </SimpleGrid>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
