import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ServiceValidationError } from '../../errors/service-validation.error';
import { validateOrThrow } from '../../lib/class-validator-extensions/validate-or-throw';

export abstract class AbstractService<Model> {
  protected constructor(protected readonly cls: ClassConstructor<Model>) {}

  protected validate(plain: any): Model {
    return validateOrThrow(
      this.cls,
      plain,
      (message) => new ServiceValidationError(...message),
    );
  }
}
