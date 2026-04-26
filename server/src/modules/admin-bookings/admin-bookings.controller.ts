import { Controller, Get } from '@nestjs/common'

import { AdminBookingsService } from './admin-bookings.service'

@Controller('admin/bookings')
export class AdminBookingsController {
  constructor(
    private readonly adminBookingsService: AdminBookingsService,
  ) {}

  @Get()
  listAdminBookings() {
    return this.adminBookingsService.listAdminBookings()
  }
}
