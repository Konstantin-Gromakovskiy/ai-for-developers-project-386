import { Body, Controller, Get, Put } from '@nestjs/common'

import { AdminAvailabilityService } from './admin-availability.service'

type ReplaceAvailabilityBody = {
  timezone: string
  weeklyRules: Array<{
    dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    startLocalTime: string
    endLocalTime: string
  }>
}

@Controller('admin/availability')
export class AdminAvailabilityController {
  constructor(
    private readonly adminAvailabilityService: AdminAvailabilityService,
  ) {}

  @Get()
  getAvailability() {
    return this.adminAvailabilityService.getAvailability()
  }

  @Put()
  replaceAvailability(@Body() body: ReplaceAvailabilityBody) {
    return this.adminAvailabilityService.replaceAvailability(body)
  }
}
