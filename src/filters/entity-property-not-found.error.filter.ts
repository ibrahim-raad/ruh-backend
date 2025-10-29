import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityPropertyNotFoundError } from 'typeorm';

@Catch(EntityPropertyNotFoundError)
export class EntityPropertyNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityPropertyNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const rethrow =
      request.method.toLowerCase() === 'get'
        ? new BadRequestException([exception.message])
        : new InternalServerErrorException();
    response.status(rethrow.getStatus()).json(rethrow.getResponse());
  }
}
