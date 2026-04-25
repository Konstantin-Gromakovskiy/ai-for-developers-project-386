import { ReactNode } from 'react'

type RootLayoutProps = {
  children: ReactNode
}

export const metadata = {
  title: 'Cal Clone',
  description: 'Simplified meeting booking frontend',
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
