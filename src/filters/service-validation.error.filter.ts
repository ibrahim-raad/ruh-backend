import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceValidationError } from '../errors/service-validation.error';

@Catch(ServiceValidationError)
export class ServiceValidationErrorFilter implements ExceptionFilter {
  catch(exception: ServiceValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const rethrow = new BadRequestException(exception.errors);
    response.status(rethrow.getStatus()).json(rethrow.getResponse());
  }
}
