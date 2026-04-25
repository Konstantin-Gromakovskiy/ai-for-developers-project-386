'use client'

import { Card, Container, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'

import {
  eventTypeOptions,
  hostProfile,
} from '@/src/entities/event-type/model/event-types'
import { EventTypeCard } from '@/src/entities/event-type/ui/event-type-card'
import { HostSummary } from '@/src/entities/event-type/ui/host-summary'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

export default function GuestPage() {
  const t = useTranslations('GuestPage')
  const tBrand = useTranslations('Brand')
  const eventTypes = eventTypeOptions.map(eventType => ({
    slug: eventType.slug,
    title: t(`eventTypes.${eventType.messageKey}.title`),
    description: t(`eventTypes.${eventType.messageKey}.description`),
    durationLabel: t(`eventTypes.${eventType.messageKey}.duration`),
  }))

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
            {eventTypes.map(eventType => (
              <EventTypeCard
                key={eventType.slug}
                description={eventType.description}
                durationLabel={eventType.durationLabel}
                href={`/book/${eventType.slug}`}
                title={eventType.title}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
