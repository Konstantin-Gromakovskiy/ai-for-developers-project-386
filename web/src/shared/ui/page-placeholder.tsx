'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ReactNode } from 'react'

type NavigationLink = {
  href: string
  label: string
}

type PagePlaceholderProps = {
  title: string
  description: string
  badge: string
  navigation?: NavigationLink[]
  children?: ReactNode
}

const shellStyle = {
  minHeight: '100vh',
  margin: 0,
  background:
    'linear-gradient(180deg, rgba(248, 249, 250, 1) 0%, rgba(233, 236, 239, 1) 100%)',
  color: '#212529',
  fontFamily: 'Arial, sans-serif',
}

const contentStyle = {
  width: '100%',
  maxWidth: '720px',
  margin: '0 auto',
  padding: '80px 24px',
}

const badgeStyle = {
  display: 'inline-block',
  padding: '6px 12px',
  borderRadius: '999px',
  backgroundColor: '#212529',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}

const titleStyle = {
  margin: '20px 0 12px',
  fontSize: '48px',
  lineHeight: 1.05,
}

const descriptionStyle = {
  margin: 0,
  fontSize: '18px',
  lineHeight: 1.6,
  color: '#495057',
}

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '12px',
  marginTop: '32px',
}

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0 16px',
  borderRadius: '10px',
  border: '1px solid #ced4da',
  backgroundColor: '#ffffff',
  color: '#212529',
  fontWeight: 600,
  textDecoration: 'none',
}

const extraStyle = {
  marginTop: '40px',
  padding: '20px',
  border: '1px solid #dee2e6',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
}

export function PagePlaceholder({
  title,
  description,
  badge,
  navigation = [],
  children,
}: PagePlaceholderProps) {
  const t = useTranslations('PagePlaceholder')

  return (
    <main style={shellStyle}>
      <div style={contentStyle}>
        <span style={badgeStyle}>{badge}</span>
        <h1 style={titleStyle}>{title}</h1>
        <p style={descriptionStyle}>{description}</p>

        {navigation.length > 0
          ? (
              <nav aria-label={t('navigationLabel')} style={actionsStyle}>
                {navigation.map(link => (
                  <Link key={link.href} href={link.href} style={linkStyle}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            )
          : null}

        {children
          ? <section style={extraStyle}>{children}</section>
          : null}
      </div>
    </main>
  )
}
