import { Module } from '@nestjs/common'

import { PublicEventTypesModule } from '../public-event-types/public-event-types.module'

import { AdminEventTypesController } from './admin-event-types.controller'
import { AdminEventTypesService } from './admin-event-types.service'

@Module({
  imports: [PublicEventTypesModule],
  controllers: [AdminEventTypesController],
  providers: [AdminEventTypesService],
})
export class AdminEventTypesModule {}
