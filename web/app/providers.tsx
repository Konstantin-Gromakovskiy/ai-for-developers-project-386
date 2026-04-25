'use client'

import { MantineProvider } from '@mantine/core'
import { ReactNode } from 'react'

import { theme } from '@/src/shared/config/theme'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MantineProvider defaultColorScheme="light" theme={theme}>
      {children}
    </MantineProvider>
  )
}
