import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneDefined', async: false })
export class AtLeastOneDefinedConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object = args.object as Record<string, any>;
    const relatedPropertyNames = args.constraints;
    return relatedPropertyNames.some(
      (relatedPropertyName: string) =>
        object[relatedPropertyName] !== undefined,
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `At least one of ${args.constraints.join(', ')} must be defined`;
  }
}

export function AtLeastOneDefined(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: properties,
      validator: AtLeastOneDefinedConstraint,
    });
  };
}
