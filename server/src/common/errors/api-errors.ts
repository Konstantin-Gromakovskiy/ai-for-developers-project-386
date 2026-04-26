import { HttpException, HttpStatus } from '@nestjs/common'

export function createValidationError(message: string) {
  return new HttpException(
    {
      code: 'validation_error',
      message,
    },
    HttpStatus.BAD_REQUEST,
  )
}

export function createNotFoundError(message: string) {
  return new HttpException(
    {
      code: 'not_found',
      message,
    },
    HttpStatus.NOT_FOUND,
  )
}

export function createConflictError(message: string) {
  return new HttpException(
    {
      code: 'conflict',
      message,
    },
    HttpStatus.CONFLICT,
  )
}
