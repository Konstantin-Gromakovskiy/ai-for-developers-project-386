'use client'

import Link from 'next/link'

import { Box, Button, Container, Group, Text } from '@mantine/core'
import { useTranslations } from 'next-intl'

type PublicHeaderProps = {
  activeSection?: 'guest' | 'owner'
}

function CalendarLogo() {
  return (
    <Box pos="relative" w={18} h={18}>
      <Box
        h={14}
        w={14}
        pos="absolute"
        top={3}
        left={2}
        style={{
          border: '1.75px solid var(--mantine-color-accent-6)',
          borderRadius: '4px',
        }}
      />
      <Box
        h={2}
        w={8}
        pos="absolute"
        top={7}
        left={5}
        bg="accent.6"
        style={{ borderRadius: 999 }}
      />
      <Box
        h={5}
        w={2}
        pos="absolute"
        top={0}
        left={5}
        bg="accent.6"
        style={{ borderRadius: 999 }}
      />
      <Box
        h={5}
        w={2}
        pos="absolute"
        top={0}
        left={11}
        bg="accent.6"
        style={{ borderRadius: 999 }}
      />
    </Box>
  )
}

export function PublicHeader({ activeSection }: PublicHeaderProps) {
  const t = useTranslations('Navigation')
  const tBrand = useTranslations('Brand')
  const navigationItems = [
    { href: '/guest', label: t('book'), section: 'guest' as const },
    { href: '/owner', label: t('admin'), section: 'owner' as const },
  ]

  return (
    <Container size="xl" h="100%" px={{ base: 'md', md: 'xl' }}>
      <Group justify="space-between" h="100%" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <CalendarLogo />
          <Text c="ink.9" fw={700} size="lg">
            {tBrand('name')}
          </Text>
        </Group>

        <Group gap="xs" wrap="nowrap">
          {navigationItems.map((item) => {
            const isActive = item.section === activeSection

            return (
              <Link href={item.href} key={item.href} style={{ textDecoration: 'none' }}>
                <Button
                  color="ink"
                  px="md"
                  size="compact-md"
                  variant={isActive ? 'light' : 'subtle'}
                >
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </Group>
      </Group>
    </Container>
  )
}
