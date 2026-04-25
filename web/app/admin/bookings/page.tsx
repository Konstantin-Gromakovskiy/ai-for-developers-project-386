'use client'

import { useTranslations } from 'next-intl'

import { AdminPlaceholderPage } from '@/src/features/admin/ui/admin-placeholder-page'

export default function AdminBookingsPage() {
  const t = useTranslations('AdminPages.bookings')

  return (
    <AdminPlaceholderPage
      badge={t('badge')}
      description={t('description')}
      nextStep={t('nextStep')}
      title={t('title')}
    />
  )
}
