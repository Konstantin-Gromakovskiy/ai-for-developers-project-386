import { PagePlaceholder } from '@/src/shared/ui/page-placeholder'

export default function OwnerPage() {
  return (
    <PagePlaceholder
      badge="Owner"
      title="Owner administration"
      description="This page will contain the owner area for managing event types, availability, overrides, and bookings."
      navigation={[{ href: '/', label: 'Back to home' }]}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Temporary placeholder for the owner scenario. The admin interface will be
        implemented here after the shared app shell and data layer are prepared.
      </p>
    </PagePlaceholder>
  )
}
