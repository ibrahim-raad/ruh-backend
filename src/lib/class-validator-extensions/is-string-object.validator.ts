import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStringObject(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: Record<string, any>) {
          if (typeof value !== 'object' || value === null) {
            return false;
          }
          return Object.keys(value).every(
            (key) => typeof key === 'string' && typeof value[key] === 'string',
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object with string keys and string values`;
        },
      },
    });
  };
}
