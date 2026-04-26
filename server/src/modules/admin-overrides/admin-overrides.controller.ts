import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common'

import { AdminOverridesService } from './admin-overrides.service'

type CreateAvailabilityOverrideBody = {
  startUtc: string
  endUtc: string
  isAvailable: boolean
}

type UpdateAvailabilityOverrideBody = {
  startUtc?: string
  endUtc?: string
  isAvailable?: boolean
}

@Controller('admin/availability-overrides')
export class AdminOverridesController {
  constructor(
    private readonly adminOverridesService: AdminOverridesService,
  ) {}

  @Get()
  listAvailabilityOverrides() {
    return this.adminOverridesService.listAvailabilityOverrides()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAvailabilityOverride(@Body() body: CreateAvailabilityOverrideBody) {
    return {
      availabilityOverride: this.adminOverridesService.createAvailabilityOverride(body),
    }
  }

  @Patch(':id')
  updateAvailabilityOverride(
    @Param('id') id: string,
    @Body() body: UpdateAvailabilityOverrideBody,
  ) {
    return this.adminOverridesService.updateAvailabilityOverride(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAvailabilityOverride(@Param('id') id: string) {
    this.adminOverridesService.deleteAvailabilityOverride(id)
  }
}
