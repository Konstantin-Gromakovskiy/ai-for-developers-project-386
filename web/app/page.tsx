'use client'

import Link from 'next/link'

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useTranslations } from 'next-intl'

import { PublicPageShell } from '@/src/shared/ui/public-page-shell'

export default function HomePage() {
  const t = useTranslations('HomePage')
  const featureItems = [
    t('features.eventType'),
    t('features.booking'),
    t('features.admin'),
  ]

  return (
    <PublicPageShell>
      <Container px={{ base: 'md', md: 'xl' }} py={{ base: 48, md: 64 }} size="xl">
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 32, md: 72 }}>
          <Stack gap="xl" maw={560} py={{ base: 12, md: 44 }}>
            <Badge color="mist" px="md" py={14} size="lg" tt="uppercase">
              {t('badge')}
            </Badge>

            <Stack gap="lg">
              <Title c="ink.9" fw={800} fz={{ base: 52, md: 68 }} lh={0.98}>
                {t('title')}
              </Title>

              <Text c="ink.5" fz={{ base: 'xl', md: 38 }} lh={1.45} maw={520}>
                {t('description')}
              </Text>
            </Stack>

            <Box>
              <Link href="/guest" style={{ textDecoration: 'none' }}>
                <Button
                  color="accent"
                  px="xl"
                  py="md"
                  rightSection={<Box component="span">-&gt;</Box>}
                  size="xl"
                >
                  {t('cta')}
                </Button>
              </Link>
            </Box>
          </Stack>

          <Card mt={{ base: 0, md: 40 }} maw={560} miw={0}>
            <Stack gap="lg">
              <Title c="ink.9" order={2}>
                {t('featuresTitle')}
              </Title>

              <List c="ink.5" spacing="md" size="lg">
                {featureItems.map(item => (
                  <List.Item key={item}>{item}</List.Item>
                ))}
              </List>
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>
    </PublicPageShell>
  )
}
