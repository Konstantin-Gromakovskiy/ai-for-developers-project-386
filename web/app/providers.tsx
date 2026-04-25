'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { NextIntlClientProvider } from 'next-intl'
import { ReactNode, useState } from 'react'

import { createQueryClient } from '@/src/shared/api/query-client'

import { theme } from '@/src/shared/config/theme'

type ProvidersProps = {
  children: ReactNode
  locale: string
  messages: Record<string, unknown>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="light" theme={theme}>
          {children}
        </MantineProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
