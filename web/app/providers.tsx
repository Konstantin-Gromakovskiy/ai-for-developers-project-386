'use client'

import { MantineProvider } from '@mantine/core'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'

import { theme } from '@/src/shared/config/theme'

type ProvidersProps = {
  children: ReactNode
  locale: string
  messages: Record<string, unknown>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <MantineProvider defaultColorScheme="light" theme={theme}>
        {children}
      </MantineProvider>
    </NextIntlClientProvider>
  )
}
