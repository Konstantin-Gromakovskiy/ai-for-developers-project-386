'use client'

import Link from 'next/link'

import { Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslations } from 'next-intl'

import { adminSections } from '@/src/features/admin/model/admin-sections'
import { AdminSectionCard } from '@/src/features/admin/ui/admin-section-card'
import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

export default function OwnerPage() {
  const t = useTranslations('OwnerPage')

  return (
    <PublicPageShell activeSection="owner" background="var(--mantine-color-mist-0)">
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 40, md: 56 }} size="xl">
        <Stack gap="xl">
          <Card>
            <Stack gap="xl">
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

              <Group>
                <Link href="/guest" style={{ textDecoration: 'none' }}>
                  <Button color="accent">{t('publicFlowAction')}</Button>
                </Link>
              </Group>
            </Stack>
          </Card>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" verticalSpacing="md">
            {adminSections.map(section => (
              <AdminSectionCard
                key={section.key}
                actionLabel={t(`sections.${section.key}.action`)}
                description={t(`sections.${section.key}.description`)}
                href={section.href}
                title={t(`sections.${section.key}.title`)}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </PublicPageShell>
  )
}
