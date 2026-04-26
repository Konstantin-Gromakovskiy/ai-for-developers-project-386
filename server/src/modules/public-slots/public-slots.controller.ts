import { Controller, Get, Param } from '@nestjs/common'

import { PublicSlotsService } from './public-slots.service'

@Controller('event-types')
export class PublicSlotsController {
  constructor(
    private readonly publicSlotsService: PublicSlotsService,
  ) {}

  @Get(':slug/slots')
  listEventTypeSlots(@Param('slug') slug: string) {
    return this.publicSlotsService.listEventTypeSlots(slug)
  }
}
