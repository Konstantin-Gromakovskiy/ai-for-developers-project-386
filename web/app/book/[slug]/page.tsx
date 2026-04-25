'use client'

import Link from 'next/link'

import { Button, Card, Container, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'
import { use } from 'react'

import {
  getEventTypeOption,
  hostProfile,
} from '@/src/entities/event-type/model/event-types'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type BookPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default function BookPage({ params }: BookPageProps) {
  const { slug } = use(params)
  const t = useTranslations('BookPage')
  const tGuest = useTranslations('GuestPage')
  const eventType = getEventTypeOption(slug)
  const eventTypeLabel = eventType
    ? tGuest(`eventTypes.${eventType.messageKey}.title`)
    : slug

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="lg">
        <Card>
          <Stack gap="lg">
            <Text c="ink.4" fw={600} size="sm" tt="uppercase">
              {t('badge')}
            </Text>

            <Title c="ink.9" order={1}>
              {t('title', { eventType: eventTypeLabel })}
            </Title>

            <Text c="ink.5" fz="lg" maw={620}>
              {t('description', { hostName: hostProfile.name })}
            </Text>

            <div>
              <Link href="/guest" style={{ textDecoration: 'none' }}>
                <Button color="ink" variant="light">
                  {t('back')}
                </Button>
              </Link>
            </div>
          </Stack>
        </Card>
      </Container>
    </PublicPageShell>
  )
}
