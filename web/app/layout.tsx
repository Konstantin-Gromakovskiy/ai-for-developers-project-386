import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

import { ColorSchemeScript } from '@mantine/core'
import { ReactNode } from 'react'

import messages from '@/messages/ru.json'

import { Providers } from './providers'

type RootLayoutProps = {
  children: ReactNode
}

export const metadata = {
  title: 'Cal Clone',
  description: 'Simplified meeting booking frontend',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#f7f9fc' }}>
        <Providers locale="ru" messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
