import { Module } from '@nestjs/common'

import { BookingsStoreModule } from '../bookings-store/bookings-store.module'
import { PublicEventTypesModule } from '../public-event-types/public-event-types.module'
import { PublicSlotsModule } from '../public-slots/public-slots.module'

import { PublicBookingsController } from './public-bookings.controller'
import { PublicBookingsService } from './public-bookings.service'

@Module({
  imports: [PublicEventTypesModule, PublicSlotsModule, BookingsStoreModule],
  controllers: [PublicBookingsController],
  providers: [PublicBookingsService],
})
export class PublicBookingsModule {}
