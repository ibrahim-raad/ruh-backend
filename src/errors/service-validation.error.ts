export class ServiceValidationError extends Error {
  readonly errors: string[];

  constructor(...errors: string[]) {
    super(`A validation error occurred in the service: ${errors.join('\n')}`);
    this.errors = errors;
  }
}
