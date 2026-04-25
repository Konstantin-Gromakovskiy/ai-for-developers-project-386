import { PagePlaceholder } from '@/src/shared/ui/page-placeholder'

export default function HomePage() {
  return (
    <PagePlaceholder
      badge="MVP"
      title="Meeting booking frontend"
      description="This is the default landing page for the web app. Public booking and owner administration flows will be implemented from here."
      navigation={[
        { href: '/guest', label: 'Open guest page' },
        { href: '/owner', label: 'Open owner page' },
      ]}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Placeholder content is installed for the first iteration. The next steps are
        the public booking flow, the owner dashboard, API integration, and i18n.
      </p>
    </PagePlaceholder>
  )
}
