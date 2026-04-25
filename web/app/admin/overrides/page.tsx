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
  createAvailabilityOverride,
  deleteAvailabilityOverride,
  listAvailabilityOverrides,
  type ApiError,
  type AvailabilityOverride,
  updateAvailabilityOverride,
} from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import {
  formatUtcInterval,
  localInputValueToUtc,
  utcToLocalInputValue,
} from '@/src/features/admin/lib/override-datetime'
import {
  OverrideForm,
  type OverrideFormValues,
} from '@/src/features/admin/ui/override-form'
import { OverrideItemCard } from '@/src/features/admin/ui/override-item-card'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type ApiErrorPayload = {
  message?: string
}

const createDefaultValues: OverrideFormValues = {
  endUtc: '',
  isAvailable: false,
  startUtc: '',
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

function toFormValues(override: AvailabilityOverride): OverrideFormValues {
  return {
    endUtc: utcToLocalInputValue(override.endUtc),
    isAvailable: override.isAvailable,
    startUtc: utcToLocalInputValue(override.startUtc),
  }
}

export default function AdminOverridesPage() {
  const t = useTranslations('AdminPages.overrides')
  const queryClient = useQueryClient()
  const [editingOverride, setEditingOverride] = useState<AvailabilityOverride | null>(null)

  const overridesQuery = useQuery({
    queryKey: queryKeys.adminAvailabilityOverrides,
    queryFn: listAvailabilityOverrides,
  })

  async function invalidateOverrideQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.adminAvailabilityOverrides }),
      queryClient.invalidateQueries({ queryKey: ['event-type-slots'] }),
    ])
  }

  const createMutation = useMutation({
    mutationFn: createAvailabilityOverride,
    onSuccess: async () => {
      await invalidateOverrideQueries()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: OverrideFormValues }) => updateAvailabilityOverride(id, {
      endUtc: localInputValueToUtc(payload.endUtc) ?? undefined,
      isAvailable: payload.isAvailable,
      startUtc: localInputValueToUtc(payload.startUtc) ?? undefined,
    }),
    onSuccess: async () => {
      await invalidateOverrideQueries()
      setEditingOverride(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteAvailabilityOverride(id),
    onSuccess: async () => {
      await invalidateOverrideQueries()
    },
  })

  const mutationError = getApiErrorMessage(
    createMutation.error ?? updateMutation.error ?? deleteMutation.error,
  )

  async function handleCreate(values: OverrideFormValues) {
    const startUtc = localInputValueToUtc(values.startUtc)
    const endUtc = localInputValueToUtc(values.endUtc)

    if (!startUtc || !endUtc) {
      return
    }

    await createMutation.mutateAsync({
      endUtc,
      isAvailable: values.isAvailable,
      startUtc,
    })
  }

  async function handleUpdate(values: OverrideFormValues) {
    if (!editingOverride) {
      return
    }

    await updateMutation.mutateAsync({
      id: editingOverride.id,
      payload: values,
    })
  }

  function handleDelete(override: AvailabilityOverride) {
    const confirmed = window.confirm(t('deleteConfirm'))

    if (!confirmed) {
      return
    }

    deleteMutation.mutate({ id: override.id })
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

          {overridesQuery.isError
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

                <OverrideForm
                  defaultValues={createDefaultValues}
                  endLabel={t('form.endLabel')}
                  endPlaceholder={t('form.endPlaceholder')}
                  invalidRangeMessage={t('validation.invalidRange')}
                  isPending={createMutation.isPending}
                  onSubmit={handleCreate}
                  requiredMessage={t('validation.required')}
                  startLabel={t('form.startLabel')}
                  startPlaceholder={t('form.startPlaceholder')}
                  statusLabel={t('form.statusLabel')}
                  submitLabel={t('create.submit')}
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

                {overridesQuery.isPending
                  ? (
                      <Stack gap="md">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <Card key={index}>
                            <Stack gap="sm">
                              <Skeleton height={18} radius="md" width="80%" />
                              <Skeleton height={36} radius="md" width="40%" />
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    )
                  : null}

                {!overridesQuery.isPending && (overridesQuery.data?.length ?? 0) === 0
                  ? (
                      <Text c="ink.5" fz="lg">
                        {t('list.empty')}
                      </Text>
                    )
                  : null}

                <Stack gap="md">
                  {overridesQuery.data?.map(override => (
                    <OverrideItemCard
                      deleteLabel={t('list.delete')}
                      editLabel={t('list.edit')}
                      intervalLabel={formatUtcInterval(override.startUtc, override.endUtc)}
                      isDeletePending={deleteMutation.isPending && deleteMutation.variables?.id === override.id}
                      key={override.id}
                      onDelete={() => handleDelete(override)}
                      onEdit={() => setEditingOverride(override)}
                      statusColor={override.isAvailable ? 'teal' : 'red'}
                      statusLabel={override.isAvailable ? t('status.available') : t('status.blocked')}
                    />
                  ))}
                </Stack>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>

      <Modal
        opened={Boolean(editingOverride)}
        onClose={() => setEditingOverride(null)}
        title={t('edit.title')}
      >
        {editingOverride
          ? (
              <OverrideForm
                cancelLabel={t('edit.cancel')}
                defaultValues={toFormValues(editingOverride)}
                endLabel={t('form.endLabel')}
                endPlaceholder={t('form.endPlaceholder')}
                invalidRangeMessage={t('validation.invalidRange')}
                isPending={updateMutation.isPending}
                onCancel={() => setEditingOverride(null)}
                onSubmit={handleUpdate}
                requiredMessage={t('validation.required')}
                startLabel={t('form.startLabel')}
                startPlaceholder={t('form.startPlaceholder')}
                statusLabel={t('form.statusLabel')}
                submitLabel={t('edit.submit')}
              />
            )
          : null}
      </Modal>
    </PublicPageShell>
  )
}
