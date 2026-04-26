import { Controller, Get, Param } from '@nestjs/common'

import { PublicEventTypesService } from './public-event-types.service'

@Controller('event-types')
export class PublicEventTypesController {
  constructor(
    private readonly publicEventTypesService: PublicEventTypesService,
  ) {}

  @Get()
  listPublicEventTypes() {
    return this.publicEventTypesService.listPublicEventTypes()
  }

  @Get(':slug')
  getPublicEventType(@Param('slug') slug: string) {
    return this.publicEventTypesService.getPublicEventType(slug)
  }
}
