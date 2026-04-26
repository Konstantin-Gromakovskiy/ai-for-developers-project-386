import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common'

import { PublicBookingsService } from './public-bookings.service'

type CreateBookingBody = {
  startUtc: string
  guestName: string
  guestEmail: string
  guestNotes?: string
}

@Controller('event-types')
export class PublicBookingsController {
  constructor(
    private readonly publicBookingsService: PublicBookingsService,
  ) {}

  @Post(':slug/bookings')
  @HttpCode(HttpStatus.CREATED)
  createBooking(
    @Param('slug') slug: string,
    @Body() body: CreateBookingBody,
  ) {
    return {
      booking: this.publicBookingsService.createBooking(slug, body),
    }
  }
}
