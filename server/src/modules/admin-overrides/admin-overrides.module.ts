import { Module } from '@nestjs/common'

import { InMemoryAvailabilityOverridesRepository } from '../../infrastructure/repositories/in-memory-availability-overrides.repository'

import { AdminOverridesController } from './admin-overrides.controller'
import { AdminOverridesService } from './admin-overrides.service'

@Module({
  controllers: [AdminOverridesController],
  providers: [AdminOverridesService, InMemoryAvailabilityOverridesRepository],
  exports: [AdminOverridesService, InMemoryAvailabilityOverridesRepository],
})
export class AdminOverridesModule {}
