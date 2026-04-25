'use client'

import { useQuery } from '@tanstack/react-query'
import { Alert, Card, Container, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'

import { hostProfile } from '@/src/entities/event-type/model/event-types'
import { EventTypeCard } from '@/src/entities/event-type/ui/event-type-card'
import { HostSummary } from '@/src/entities/event-type/ui/host-summary'
import { listPublicEventTypes } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

export default function GuestPage() {
  const t = useTranslations('GuestPage')
  const tBrand = useTranslations('Brand')
  const eventTypesQuery = useQuery({
    queryKey: queryKeys.publicEventTypes,
    queryFn: listPublicEventTypes,
  })

  const eventTypes = eventTypesQuery.data ?? []

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 42 }} size="lg">
        <Stack gap="xl">
          <Card>
            <Stack gap="xl">
              <HostSummary name={hostProfile.name} role={t('hostRole')} />

              <Stack gap="sm">
                <Title c="ink.9" order={1} fz={{ base: 40, md: 54 }} lh={1.05}>
                  {t('title')}
                </Title>
                <Text c="ink.4" fz="lg" lh={1.55}>
                  {t('description', { productName: tBrand('name') })}
                </Text>
              </Stack>
            </Stack>
          </Card>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" verticalSpacing="md">
            {eventTypesQuery.isPending
              ? Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} h="100%">
                    <Stack gap="md">
                      <Skeleton height={28} radius="md" />
                      <Skeleton height={18} radius="md" width="85%" />
                      <Skeleton height={18} radius="md" width="65%" />
                    </Stack>
                  </Card>
                ))
              : null}

            {eventTypesQuery.isError
              ? (
                  <Alert color="red" title={t('errors.loadEventTypesTitle')} variant="light">
                    {t('errors.loadEventTypesDescription')}
                  </Alert>
                )
              : null}

            {!eventTypesQuery.isPending && !eventTypesQuery.isError
              ? eventTypes.map(eventType => (
                  <EventTypeCard
                    key={eventType.slug}
                    description={eventType.description ?? t('emptyDescription')}
                    durationLabel={t('duration', { minutes: eventType.durationMinutes })}
                    href={`/book/${eventType.slug}`}
                    title={eventType.title}
                  />
                ))
              : null}
          </SimpleGrid>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
