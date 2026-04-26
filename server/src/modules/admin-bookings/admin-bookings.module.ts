import { Module } from '@nestjs/common'

import { BookingsStoreModule } from '../bookings-store/bookings-store.module'

import { AdminBookingsController } from './admin-bookings.controller'
import { AdminBookingsService } from './admin-bookings.service'

@Module({
  imports: [BookingsStoreModule],
  controllers: [AdminBookingsController],
  providers: [AdminBookingsService],
})
export class AdminBookingsModule {}
