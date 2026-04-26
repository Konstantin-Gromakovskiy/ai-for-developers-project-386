import { Module } from '@nestjs/common'

import { AdminAvailabilityModule } from '../admin-availability/admin-availability.module'
import { AdminOverridesModule } from '../admin-overrides/admin-overrides.module'
import { BookingsStoreModule } from '../bookings-store/bookings-store.module'
import { PublicEventTypesModule } from '../public-event-types/public-event-types.module'

import { PublicSlotsController } from './public-slots.controller'
import { PublicSlotsService } from './public-slots.service'

@Module({
  imports: [
    PublicEventTypesModule,
    AdminAvailabilityModule,
    AdminOverridesModule,
    BookingsStoreModule,
  ],
  controllers: [PublicSlotsController],
  providers: [PublicSlotsService],
})
export class PublicSlotsModule {}
