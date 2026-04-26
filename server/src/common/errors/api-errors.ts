import { HttpException, HttpStatus } from '@nestjs/common'

export function createNotFoundError(message: string) {
  return new HttpException(
    {
      code: 'not_found',
      message,
    },
    HttpStatus.NOT_FOUND,
  )
}
