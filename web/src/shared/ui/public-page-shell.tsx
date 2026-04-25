'use client'

import { ReactNode } from 'react'

import { AppShell, Box } from '@mantine/core'

import { PublicHeader } from '@/src/shared/ui/public-header'

type PublicPageShellProps = {
  children: ReactNode
  activeSection?: 'guest' | 'owner'
  background?: string
}

const defaultBackground
  = 'linear-gradient(118deg, rgba(219, 229, 255, 0.96) 0%, rgba(247, 249, 252, 0.92) 46%, rgba(255, 244, 236, 0.98) 100%)'

export function PublicPageShell({
  children,
  activeSection,
  background = defaultBackground,
}: PublicPageShellProps) {
  return (
    <AppShell header={{ height: 60 }} padding={0} withBorder={false}>
      <AppShell.Header
        bg="white"
        style={{ borderBottom: '1px solid var(--mantine-color-mist-2)' }}
      >
        <PublicHeader activeSection={activeSection} />
      </AppShell.Header>

      <AppShell.Main>
        <Box
          mih="calc(100dvh - 60px)"
          style={{ background, overflow: 'hidden' }}
        >
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  )
}
