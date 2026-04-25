'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import {
  Alert,
  Button,
  Card,
  Container,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import {
  createEventType,
  deleteEventType,
  listAdminEventTypes,
  type ApiError,
  type EventType,
  updateEventType,
} from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'
import {
  EventTypeForm,
  type EventTypeFormValues,
} from '@/src/features/admin/ui/event-type-form'
import { EventTypeItemCard } from '@/src/features/admin/ui/event-type-item-card'

const createDefaultValues: EventTypeFormValues = {
  title: '',
  description: '',
  durationMinutes: 15,
  isActive: true,
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

function toFormValues(eventType: EventType): EventTypeFormValues {
  return {
    description: eventType.description ?? '',
    durationMinutes: eventType.durationMinutes,
    isActive: eventType.isActive,
    title: eventType.title,
  }
}

export default function AdminEventTypesPage() {
  const t = useTranslations('AdminPages.eventTypes')
  const queryClient = useQueryClient()
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null)

  const eventTypesQuery = useQuery({
    queryKey: queryKeys.adminEventTypes,
    queryFn: listAdminEventTypes,
  })

  async function invalidateEventTypeQueries(slug?: string) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.adminEventTypes }),
      queryClient.invalidateQueries({ queryKey: queryKeys.publicEventTypes }),
      slug ? queryClient.invalidateQueries({ queryKey: queryKeys.publicEventType(slug) }) : Promise.resolve(),
      slug ? queryClient.invalidateQueries({ queryKey: queryKeys.eventTypeSlots(slug) }) : Promise.resolve(),
    ])
  }

  const createMutation = useMutation({
    mutationFn: createEventType,
    onSuccess: async () => {
      await invalidateEventTypeQueries()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: EventTypeFormValues }) => updateEventType(id, payload),
    onSuccess: async (_, variables) => {
      const currentEventType = eventTypesQuery.data?.find(eventType => eventType.id === variables.id)

      await invalidateEventTypeQueries(currentEventType?.slug)
      setEditingEventType(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteEventType(id),
    onSuccess: async (_, variables) => {
      const currentEventType = eventTypesQuery.data?.find(eventType => eventType.id === variables.id)

      await invalidateEventTypeQueries(currentEventType?.slug)
    },
  })

  const mutationError = getApiErrorMessage(
    createMutation.error ?? updateMutation.error ?? deleteMutation.error,
  )

  async function handleCreate(values: EventTypeFormValues) {
    await createMutation.mutateAsync({
      description: values.description.trim() || undefined,
      durationMinutes: values.durationMinutes,
      isActive: values.isActive,
      title: values.title.trim(),
    })
  }

  async function handleUpdate(values: EventTypeFormValues) {
    if (!editingEventType) {
      return
    }

    await updateMutation.mutateAsync({
      id: editingEventType.id,
      payload: {
        description: values.description.trim() || undefined,
        durationMinutes: values.durationMinutes,
        isActive: values.isActive,
        title: values.title.trim(),
      },
    })
  }

  function handleDelete(eventType: EventType) {
    const confirmed = window.confirm(t('deleteConfirm', { title: eventType.title }))

    if (!confirmed) {
      return
    }

    deleteMutation.mutate({ id: eventType.id })
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

          {eventTypesQuery.isError
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

          <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md" verticalSpacing="md">
            <Card>
              <Stack gap="lg">
                <Stack gap="sm">
                  <Title c="ink.9" order={2}>
                    {t('create.title')}
                  </Title>
                  <Text c="ink.5" fz="lg" lh={1.55}>
                    {t('create.description')}
                  </Text>
                </Stack>

                <EventTypeForm
                  defaultValues={createDefaultValues}
                  durationLabel={t('form.durationLabel')}
                  durationMinMessage={t('validation.durationMin')}
                  durationRequiredMessage={t('validation.durationRequired')}
                  guestDescriptionLabel={t('form.descriptionLabel')}
                  guestDescriptionPlaceholder={t('form.descriptionPlaceholder')}
                  isPending={createMutation.isPending}
                  onSubmit={handleCreate}
                  statusLabel={t('form.statusLabel')}
                  submitLabel={t('create.submit')}
                  titleLabel={t('form.titleLabel')}
                  titlePlaceholder={t('form.titlePlaceholder')}
                  titleRequiredMessage={t('validation.titleRequired')}
                />
              </Stack>
            </Card>

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

                {eventTypesQuery.isPending
                  ? (
                      <Stack gap="md">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <Card key={index}>
                            <Stack gap="sm">
                              <Skeleton height={28} radius="md" width="60%" />
                              <Skeleton height={18} radius="md" width="35%" />
                              <Skeleton height={18} radius="md" width="100%" />
                              <Skeleton height={18} radius="md" width="80%" />
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    )
                  : null}

                {!eventTypesQuery.isPending && (eventTypesQuery.data?.length ?? 0) === 0
                  ? (
                      <Text c="ink.5" fz="lg">
                        {t('list.empty')}
                      </Text>
                    )
                  : null}

                <Stack gap="md">
                  {eventTypesQuery.data?.map(eventType => (
                    <EventTypeItemCard
                      key={eventType.id}
                      deleteLabel={t('list.delete')}
                      description={eventType.description ?? t('list.emptyDescription')}
                      durationLabel={t('duration', { minutes: eventType.durationMinutes })}
                      editLabel={t('list.edit')}
                      isDeletePending={deleteMutation.isPending && deleteMutation.variables?.id === eventType.id}
                      onDelete={() => handleDelete(eventType)}
                      onEdit={() => setEditingEventType(eventType)}
                      slug={eventType.slug}
                      statusColor={eventType.isActive ? 'teal' : 'gray'}
                      statusLabel={eventType.isActive ? t('status.active') : t('status.inactive')}
                      title={eventType.title}
                    />
                  ))}
                </Stack>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>

      <Modal
        opened={Boolean(editingEventType)}
        onClose={() => setEditingEventType(null)}
        title={t('edit.title')}
      >
        {editingEventType
          ? (
              <EventTypeForm
                cancelLabel={t('edit.cancel')}
                defaultValues={toFormValues(editingEventType)}
                durationLabel={t('form.durationLabel')}
                durationMinMessage={t('validation.durationMin')}
                durationRequiredMessage={t('validation.durationRequired')}
                guestDescriptionLabel={t('form.descriptionLabel')}
                guestDescriptionPlaceholder={t('form.descriptionPlaceholder')}
                isPending={updateMutation.isPending}
                onCancel={() => setEditingEventType(null)}
                onSubmit={handleUpdate}
                statusLabel={t('form.statusLabel')}
                submitLabel={t('edit.submit')}
                titleLabel={t('form.titleLabel')}
                titlePlaceholder={t('form.titlePlaceholder')}
                titleRequiredMessage={t('validation.titleRequired')}
              />
            )
          : null}
      </Modal>
    </PublicPageShell>
  )
}
