'use client'

import { useTranslations } from 'next-intl'

import { PagePlaceholder } from '@/src/shared/ui/page-placeholder'

export default function OwnerPage() {
  const t = useTranslations('OwnerPage')
  const tNavigation = useTranslations('Navigation')

  return (
    <PagePlaceholder
      badge={t('badge')}
      title={t('title')}
      description={t('description')}
      navigation={[{ href: '/', label: tNavigation('home') }]}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        {t('body')}
      </p>
    </PagePlaceholder>
  )
}
