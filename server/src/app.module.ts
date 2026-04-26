import { Module } from '@nestjs/common'

import { HealthModule } from './modules/health/health.module'
import { PublicEventTypesModule } from './modules/public-event-types/public-event-types.module'

@Module({
  imports: [HealthModule, PublicEventTypesModule],
})
export class AppModule {}
