'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import {
  Alert,
  Button,
  Card,
  Container,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'

import { getAvailability, replaceAvailability, type ApiError } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'
import { AvailabilityRuleRow } from '@/src/features/admin/ui/availability-rule-row'

type AvailabilityFormValues = {
  timezone: string
  weeklyRules: Array<{
    dayOfWeek: string
    startLocalTime: string
    endLocalTime: string
  }>
}

type ApiErrorPayload = {
  message?: string
}

const emptyRule = {
  dayOfWeek: 'monday',
  endLocalTime: '18:00',
  startLocalTime: '09:00',
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

function toFormValues(data?: {
  timezone: string
  weeklyRules: Array<{
    dayOfWeek: string
    startLocalTime: string
    endLocalTime: string
  }>
}) {
  return {
    timezone: data?.timezone ?? 'UTC',
    weeklyRules: data?.weeklyRules?.map(rule => ({
      dayOfWeek: rule.dayOfWeek,
      endLocalTime: rule.endLocalTime,
      startLocalTime: rule.startLocalTime,
    })) ?? [emptyRule],
  }
}

export default function AdminAvailabilityPage() {
  const t = useTranslations('AdminPages.availability')
  const queryClient = useQueryClient()

  const availabilityQuery = useQuery({
    queryKey: queryKeys.adminAvailability,
    queryFn: getAvailability,
  })

  const form = useForm<AvailabilityFormValues>({
    defaultValues: toFormValues(),
  })

  const rulesFieldArray = useFieldArray({
    control: form.control,
    name: 'weeklyRules',
  })

  useEffect(() => {
    if (!availabilityQuery.data) {
      return
    }

    form.reset(toFormValues(availabilityQuery.data))
  }, [availabilityQuery.data, form])

  const replaceMutation = useMutation({
    mutationFn: replaceAvailability,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminAvailability }),
        queryClient.invalidateQueries({ queryKey: ['event-type-slots'] }),
      ])
    },
  })

  const mutationError = getApiErrorMessage(replaceMutation.error)

  const dayOptions = [
    { label: t('days.monday'), value: 'monday' },
    { label: t('days.tuesday'), value: 'tuesday' },
    { label: t('days.wednesday'), value: 'wednesday' },
    { label: t('days.thursday'), value: 'thursday' },
    { label: t('days.friday'), value: 'friday' },
    { label: t('days.saturday'), value: 'saturday' },
    { label: t('days.sunday'), value: 'sunday' },
  ]

  async function handleSubmit(values: AvailabilityFormValues) {
    await replaceMutation.mutateAsync({
      timezone: values.timezone.trim(),
      weeklyRules: values.weeklyRules.map(rule => ({
        dayOfWeek: rule.dayOfWeek as
        | 'friday'
        | 'monday'
        | 'saturday'
        | 'sunday'
        | 'thursday'
        | 'tuesday'
        | 'wednesday',
        endLocalTime: rule.endLocalTime,
        startLocalTime: rule.startLocalTime,
      })),
    })
  }

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

          {availabilityQuery.isError
            ? (
                <Alert color="red" title={t('errors.loadTitle')} variant="light">
                  {t('errors.loadDescription')}
                </Alert>
              )
            : null}

          {mutationError
            ? (
                <Alert color="red" title={t('errors.submitTitle')} variant="light">
                  {mutationError}
                </Alert>
              )
            : null}

          <Card component="form" onSubmit={form.handleSubmit(handleSubmit)}>
            <Stack gap="xl">
              <Stack gap="sm">
                <Title c="ink.9" order={2}>
                  {t('form.title')}
                </Title>
                <Text c="ink.5" fz="lg" lh={1.55}>
                  {t('form.description')}
                </Text>
              </Stack>

              {availabilityQuery.isPending
                ? (
                    <Stack gap="md">
                      <Skeleton height={36} radius="md" width="40%" />
                      <Skeleton height={100} radius="md" />
                      <Skeleton height={100} radius="md" />
                    </Stack>
                  )
                : (
                    <>
                      <TextInput
                        error={form.formState.errors.timezone?.message}
                        label={t('form.timezoneLabel')}
                        placeholder={t('form.timezonePlaceholder')}
                        {...form.register('timezone', {
                          required: t('validation.timezoneRequired'),
                          validate: value => value.trim().length > 0 || t('validation.timezoneRequired'),
                        })}
                      />

                      <Stack gap="md">
                        <Group justify="space-between">
                          <Title c="ink.9" order={3}>
                            {t('form.rulesTitle')}
                          </Title>

                          <Button
                            color="ink"
                            onClick={() => rulesFieldArray.append(emptyRule)}
                            type="button"
                            variant="light"
                          >
                            {t('form.addRule')}
                          </Button>
                        </Group>

                        {rulesFieldArray.fields.length === 0
                          ? (
                              <Text c="ink.5" fz="lg">
                                {t('form.emptyRules')}
                              </Text>
                            )
                          : null}

                        <Stack gap="md">
                          {rulesFieldArray.fields.map((field, index) => (
                            <AvailabilityRuleRow
                              control={form.control}
                              dayLabel={t('form.dayLabel')}
                              dayOptions={dayOptions}
                              endLabel={t('form.endTimeLabel')}
                              endPlaceholder={t('form.endTimePlaceholder')}
                              errors={form.formState.errors}
                              index={index}
                              invalidRangeMessage={t('validation.invalidRange')}
                              key={field.id}
                              onRemove={() => rulesFieldArray.remove(index)}
                              removeLabel={t('form.removeRule')}
                              requiredMessage={t('validation.ruleRequired')}
                              startLabel={t('form.startTimeLabel')}
                              startPlaceholder={t('form.startTimePlaceholder')}
                            />
                          ))}
                        </Stack>
                      </Stack>

                      <Group>
                        <Button loading={replaceMutation.isPending} type="submit">
                          {t('form.submit')}
                        </Button>
                      </Group>
                    </>
                  )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
