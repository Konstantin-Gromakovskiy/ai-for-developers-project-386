import { PagePlaceholder } from '@/src/shared/ui/page-placeholder'

export default function GuestPage() {
  return (
    <PagePlaceholder
      badge="Guest"
      title="Guest booking flow"
      description="This page will contain the public booking experience: event type details, available slots, and booking creation."
      navigation={[{ href: '/', label: 'Back to home' }]}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Temporary placeholder for the guest scenario. Real content will be connected
        to public API endpoints and translated UI messages.
      </p>
    </PagePlaceholder>
  )
}
