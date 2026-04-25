'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { use } from 'react'

import { Button, Card, Container, Stack, Text, Title } from '@mantine/core'

import { formatSelectedDate } from '@/src/features/booking/lib/format-booking'
import { getPublicEventType } from '@/src/shared/api'
import { queryKeys } from '@/src/shared/api/query-keys'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type BookDetailsPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { slug } = use(params)
  const searchParams = useSearchParams()
  const t = useTranslations('BookDetailsPage')
  const selectedDate = searchParams.get('date')
  const selectedTime = searchParams.get('time')
  const eventTypeQuery = useQuery({
    queryKey: queryKeys.publicEventType(slug),
    queryFn: () => getPublicEventType(slug),
  })
  const eventTypeLabel = eventTypeQuery.data?.title ?? slug

  return (
    <PublicPageShell activeSection="guest" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="lg">
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
                {t('date', { date: selectedDate ? formatSelectedDate(selectedDate) : t('none') })}
              </Text>
              <Text c="ink.5" fz="lg">
                {t('time', { time: selectedTime ?? t('none') })}
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
      </Container>
    </PublicPageShell>
  )
}
