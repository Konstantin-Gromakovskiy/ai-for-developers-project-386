import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'

import { AdminEventTypesService } from './admin-event-types.service'

type CreateEventTypeBody = {
  title: string
  description?: string
  durationMinutes: number
  isActive?: boolean
}

type UpdateEventTypeBody = {
  title?: string
  description?: string
  durationMinutes?: number
  isActive?: boolean
}

@Controller('admin/event-types')
export class AdminEventTypesController {
  constructor(
    private readonly adminEventTypesService: AdminEventTypesService,
  ) {}

  @Get()
  listAdminEventTypes() {
    return this.adminEventTypesService.listAdminEventTypes()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createEventType(@Body() body: CreateEventTypeBody) {
    return {
      eventType: this.adminEventTypesService.createEventType(body),
    }
  }

  @Patch(':id')
  updateEventType(@Param('id') id: string, @Body() body: UpdateEventTypeBody) {
    return this.adminEventTypesService.updateEventType(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteEventType(@Param('id') id: string) {
    this.adminEventTypesService.deleteEventType(id)
  }
}
