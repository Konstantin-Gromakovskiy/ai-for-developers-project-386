import { Module } from '@nestjs/common'

import { AdminBookingsModule } from './modules/admin-bookings/admin-bookings.module'
import { HealthModule } from './modules/health/health.module'
import { AdminAvailabilityModule } from './modules/admin-availability/admin-availability.module'
import { AdminEventTypesModule } from './modules/admin-event-types/admin-event-types.module'
import { AdminOverridesModule } from './modules/admin-overrides/admin-overrides.module'
import { BookingsStoreModule } from './modules/bookings-store/bookings-store.module'
import { PublicBookingsModule } from './modules/public-bookings/public-bookings.module'
import { PublicEventTypesModule } from './modules/public-event-types/public-event-types.module'
import { PublicSlotsModule } from './modules/public-slots/public-slots.module'

@Module({
  imports: [
    HealthModule,
    PublicEventTypesModule,
    PublicSlotsModule,
    PublicBookingsModule,
    AdminBookingsModule,
    AdminEventTypesModule,
    AdminAvailabilityModule,
    AdminOverridesModule,
    BookingsStoreModule,
  ],
})
export class AppModule {}
