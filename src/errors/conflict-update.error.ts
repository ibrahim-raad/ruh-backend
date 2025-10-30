import { DATABASE_ERROR_MESSAGES } from '../app.constants';

export class ConflictUpdateError extends Error {
  constructor(message: string = DATABASE_ERROR_MESSAGES.CONFLICT_VIOLATION) {
    super(message);
  }
}
