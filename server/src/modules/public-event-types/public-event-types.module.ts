import { Module } from '@nestjs/common'

import { InMemoryEventTypesRepository } from '../../infrastructure/repositories/in-memory-event-types.repository'

import { PublicEventTypesController } from './public-event-types.controller'
import { PublicEventTypesService } from './public-event-types.service'

@Module({
  controllers: [PublicEventTypesController],
  providers: [PublicEventTypesService, InMemoryEventTypesRepository],
  exports: [PublicEventTypesService, InMemoryEventTypesRepository],
})
export class PublicEventTypesModule {}
