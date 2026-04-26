import { Module } from '@nestjs/common'

import { InMemoryAvailabilityRepository } from '../../infrastructure/repositories/in-memory-availability.repository'

import { AdminAvailabilityController } from './admin-availability.controller'
import { AdminAvailabilityService } from './admin-availability.service'

@Module({
  controllers: [AdminAvailabilityController],
  providers: [AdminAvailabilityService, InMemoryAvailabilityRepository],
  exports: [AdminAvailabilityService, InMemoryAvailabilityRepository],
})
export class AdminAvailabilityModule {}
