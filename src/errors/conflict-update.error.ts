import { ConflictException } from '@nestjs/common';
import { DATABASE_ERROR_MESSAGES } from '../app.constants';

export class ConflictUpdateError extends ConflictException {
  constructor(message: string = DATABASE_ERROR_MESSAGES.VERSION_CONFLICT) {
    super(message);
  }
}
