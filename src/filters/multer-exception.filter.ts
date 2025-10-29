import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Response } from 'express';

@Catch(MulterError, Error)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MulterError) {
      let message = exception.message;
      switch (exception.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File size exceeds the allowed limit.';
          break;
        case 'LIMIT_FILE_COUNT':
          message = 'Too many files uploaded.';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'Unexpected file field.';
          break;
        default:
          message = exception.message;
      }

      const badRequest = new BadRequestException(message);
      return response
        .status(badRequest.getStatus())
        .json(badRequest.getResponse());
    }

    if (exception instanceof Error) {
      const badRequest = new BadRequestException(exception.message);
      return response
        .status(badRequest.getStatus())
        .json(badRequest.getResponse());
    }

    const badRequest = new BadRequestException('File upload error');
    response.status(badRequest.getStatus()).json(badRequest.getResponse());
  }
}
