'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { use } from 'react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core'

import { createBooking, getPublicEventType, type ApiError } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import {
  formatSelectedDate,
  formatSlotTimeRange,
  getLocalDateFromUtc,
} from '@/src/features/booking/lib/format-booking'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type BookDetailsPageProps = {
  params: Promise<{
    slug: string
  }>
}

type BookingFormValues = {
  guestName: string
  guestEmail: string
  guestNotes: string
}

type ApiErrorPayload = {
  message?: string
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof Error && 'payload' in error) {
    const apiError = error as ApiError<ApiErrorPayload>
    return apiError.payload?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return null
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const t = useTranslations('BookDetailsPage')
  const startUtc = searchParams.get('startUtc')
  const selectedDate = searchParams.get('date') ?? (startUtc ? getLocalDateFromUtc(startUtc) : null)
  const selectedTime = searchParams.get('time')

  const eventTypeQuery = useQuery({
    queryKey: queryKeys.publicEventType(slug),
    queryFn: () => getPublicEventType(slug),
  })

  const form = useForm<BookingFormValues>({
    defaultValues: {
      guestEmail: '',
      guestName: '',
      guestNotes: '',
    },
  })

  const bookingMutation = useMutation({
    mutationFn: async (values: BookingFormValues) => {
      if (!startUtc) {
        throw new Error(t('errors.missingSelectionDescription'))
      }

      return createBooking(slug, {
        guestEmail: values.guestEmail,
        guestName: values.guestName,
        guestNotes: values.guestNotes.trim() ? values.guestNotes.trim() : undefined,
        startUtc,
      })
    },
  })

  const eventTypeLabel = eventTypeQuery.data?.title ?? slug
  const selectedDateLabel = selectedDate ? formatSelectedDate(selectedDate) : t('none')
  const selectedTimeLabel = selectedTime ?? (bookingMutation.data
    ? formatSlotTimeRange(bookingMutation.data.booking.startUtc, bookingMutation.data.booking.endUtc)
    : t('none'))
  const submitErrorMessage = getApiErrorMessage(bookingMutation.error)

  function onSubmit(values: BookingFormValues) {
    return bookingMutation.mutateAsync(values)
  }

  const isSelectionMissing = !startUtc

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="xl">
        <Stack gap="xl">
          {isSelectionMissing
            ? (
                <Alert color="red" title={t('errors.missingSelectionTitle')} variant="light">
                  {t('errors.missingSelectionDescription')}
                </Alert>
              )
            : null}

          {eventTypeQuery.isError
            ? (
                <Alert color="red" title={t('errors.loadEventTypeTitle')} variant="light">
                  {t('errors.loadEventTypeDescription')}
                </Alert>
              )
            : null}

          {bookingMutation.isError && submitErrorMessage
            ? (
                <Alert color="red" title={t('errors.submitTitle')} variant="light">
                  {submitErrorMessage}
                </Alert>
              )
            : null}

          {bookingMutation.isSuccess
            ? (
                <Card>
                  <Stack gap="xl">
                    <Stack gap="sm">
                      <Text c="ink.4" fw={600} size="sm" tt="uppercase">
                        {t('success.badge')}
                      </Text>

                      <Title c="ink.9" order={1}>
                        {t('success.title')}
                      </Title>

                      <Text c="ink.5" fz="lg" maw={720}>
                        {t('success.description')}
                      </Text>
                    </Stack>

                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                      <Card bg="mist.1" padding="lg" shadow="none" withBorder={false}>
                        <Stack gap="xs">
                          <Text c="ink.4" fz="md">{t('eventTypeLabel')}</Text>
                          <Text c="ink.9" fw={700} fz="lg">{eventTypeLabel}</Text>
                        </Stack>
                      </Card>

                      <Card bg="mist.1" padding="lg" shadow="none" withBorder={false}>
                        <Stack gap="xs">
                          <Text c="ink.4" fz="md">{t('guestNameLabel')}</Text>
                          <Text c="ink.9" fw={700} fz="lg">{bookingMutation.data.booking.guestName}</Text>
                        </Stack>
                      </Card>

                      <Card bg="mist.1" padding="lg" shadow="none" withBorder={false}>
                        <Stack gap="xs">
                          <Text c="ink.4" fz="md">{t('dateLabel')}</Text>
                          <Text c="ink.9" fw={700} fz="lg">
                            {formatSelectedDate(getLocalDateFromUtc(bookingMutation.data.booking.startUtc))}
                          </Text>
                        </Stack>
                      </Card>

                      <Card bg="mist.1" padding="lg" shadow="none" withBorder={false}>
                        <Stack gap="xs">
                          <Text c="ink.4" fz="md">{t('timeLabel')}</Text>
                          <Text c="ink.9" fw={700} fz="lg">
                            {formatSlotTimeRange(
                              bookingMutation.data.booking.startUtc,
                              bookingMutation.data.booking.endUtc,
                            )}
                          </Text>
                        </Stack>
                      </Card>
                    </SimpleGrid>

                    <Group>
                      <Link href="/guest" style={{ textDecoration: 'none' }}>
                        <Button color="accent">{t('success.toGuest')}</Button>
                      </Link>
                      <Link href={`/book/${slug}`} style={{ textDecoration: 'none' }}>
                        <Button color="ink" variant="light">{t('success.bookAnother')}</Button>
                      </Link>
                    </Group>
                  </Stack>
                </Card>
              )
            : (
                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                  <Card>
                    <Stack gap="lg">
                      <Text c="ink.4" fw={600} size="sm" tt="uppercase">
                        {t('badge')}
                      </Text>

                      <Title c="ink.9" order={1}>
                        {t('title')}
                      </Title>

                      <Stack gap="xs">
                        <Text c="ink.5" fz="lg">
                          {t('eventType', { eventType: eventTypeLabel })}
                        </Text>
                        <Text c="ink.5" fz="lg">
                          {t('date', { date: selectedDateLabel })}
                        </Text>
                        <Text c="ink.5" fz="lg">
                          {t('time', { time: selectedTimeLabel })}
                        </Text>
                      </Stack>

                      <Text c="ink.5" fz="lg" maw={620}>
                        {t('description')}
                      </Text>

                      <div>
                        <Link href={`/book/${slug}`} style={{ textDecoration: 'none' }}>
                          <Button color="ink" variant="light">
                            {t('back')}
                          </Button>
                        </Link>
                      </div>
                    </Stack>
                  </Card>

                  <Card component="form" onSubmit={form.handleSubmit(onSubmit)}>
                    <Stack gap="lg">
                      <Title c="ink.9" order={2}>
                        {t('form.title')}
                      </Title>

                      <TextInput
                        error={form.formState.errors.guestName?.message}
                        label={t('form.guestNameLabel')}
                        placeholder={t('form.guestNamePlaceholder')}
                        {...form.register('guestName', {
                          required: t('validation.guestNameRequired'),
                          validate: value => value.trim().length > 0 || t('validation.guestNameRequired'),
                        })}
                      />

                      <TextInput
                        error={form.formState.errors.guestEmail?.message}
                        label={t('form.guestEmailLabel')}
                        placeholder={t('form.guestEmailPlaceholder')}
                        type="email"
                        {...form.register('guestEmail', {
                          pattern: {
                            message: t('validation.guestEmailInvalid'),
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          },
                          required: t('validation.guestEmailRequired'),
                        })}
                      />

                      <Textarea
                        autosize
                        label={t('form.guestNotesLabel')}
                        minRows={4}
                        placeholder={t('form.guestNotesPlaceholder')}
                        {...form.register('guestNotes')}
                      />

                      <Group>
                        <Button
                          color="accent"
                          disabled={isSelectionMissing}
                          loading={bookingMutation.isPending}
                          type="submit"
                        >
                          {t('form.submit')}
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </SimpleGrid>
              )}
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
