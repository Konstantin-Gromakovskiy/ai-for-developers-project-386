export type AdminSectionKey = 'eventTypes' | 'availability' | 'overrides' | 'bookings'

export const adminSections: Array<{
  key: AdminSectionKey
  href: string
}> = [
  {
    key: 'eventTypes',
    href: '/admin/event-types',
  },
  {
    key: 'availability',
    href: '/admin/availability',
  },
  {
    key: 'overrides',
    href: '/admin/overrides',
  },
  {
    key: 'bookings',
    href: '/admin/bookings',
  },
]
