import { Global, Module } from '@nestjs/common'

import { InMemoryBookingsRepository } from '../../infrastructure/repositories/in-memory-bookings.repository'

@Global()
@Module({
  providers: [InMemoryBookingsRepository],
  exports: [InMemoryBookingsRepository],
})
export class BookingsStoreModule {}
