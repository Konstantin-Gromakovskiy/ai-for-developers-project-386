'use client'

import Link from 'next/link'

import { Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'

import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

type AdminPlaceholderPageProps = {
  badge: string
  title: string
  description: string
  nextStep: string
}

export function AdminPlaceholderPage({
  badge,
  title,
  description,
  nextStep,
}: AdminPlaceholderPageProps) {
  const t = useTranslations('AdminPlaceholder')

  return (
    <PublicPageShell activeSection="owner" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="lg">
        <Card>
          <Stack gap="xl">
            <Stack gap="sm">
              <Text c="ink.4" fw={700} size="sm" tt="uppercase">
                {badge}
              </Text>
              <Title c="ink.9" order={1}>
                {title}
              </Title>
              <Text c="ink.5" fz="lg" lh={1.6} maw={680}>
                {description}
              </Text>
            </Stack>

            <Card bg="mist.1" padding="lg" shadow="none" withBorder={false}>
              <Stack gap="xs">
                <Text c="ink.4" fz="md" fw={600}>
                  {t('nextStepLabel')}
                </Text>
                <Text c="ink.9" fz="lg" fw={700}>
                  {nextStep}
                </Text>
              </Stack>
            </Card>

            <Group>
              <Link href="/owner" style={{ textDecoration: 'none' }}>
                <Button color="ink" variant="light">
                  {t('back')}
                </Button>
              </Link>
              <Link href="/guest" style={{ textDecoration: 'none' }}>
                <Button color="accent">{t('publicFlowAction')}</Button>
              </Link>
            </Group>
          </Stack>
        </Card>
      </Container>
    </PublicPageShell>
  )
}
