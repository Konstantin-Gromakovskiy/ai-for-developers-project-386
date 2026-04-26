import { Module } from '@nestjs/common'

import { HealthModule } from './modules/health/health.module'
import { AdminAvailabilityModule } from './modules/admin-availability/admin-availability.module'
import { AdminEventTypesModule } from './modules/admin-event-types/admin-event-types.module'
import { PublicEventTypesModule } from './modules/public-event-types/public-event-types.module'

@Module({
  imports: [
    HealthModule,
    PublicEventTypesModule,
    AdminEventTypesModule,
    AdminAvailabilityModule,
  ],
})
export class AppModule {}
