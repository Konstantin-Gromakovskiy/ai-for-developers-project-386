'use client'

import { useTranslations } from 'next-intl'

import { AdminPlaceholderPage } from '@/src/features/admin/ui/admin-placeholder-page'

export default function AdminEventTypesPage() {
  const t = useTranslations('AdminPages.eventTypes')

  return (
    <AdminPlaceholderPage
      badge={t('badge')}
      description={t('description')}
      nextStep={t('nextStep')}
      title={t('title')}
    />
  )
}
