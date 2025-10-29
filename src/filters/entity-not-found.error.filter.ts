import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Response } from 'express';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const rethrow = new NotFoundException();
    response.status(rethrow.getStatus()).json(rethrow.getResponse());
  }
}
