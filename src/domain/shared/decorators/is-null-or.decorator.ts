import { buildMessage, ValidateBy, ValidationArguments } from 'class-validator';

export function IsNullOr(
  condition: (object: any, value: any) => boolean,
  message: string,
): PropertyDecorator {
  return ValidateBy({
    name: 'IsNullOr',
    validator: {
      validate: (value: any, args: ValidationArguments): boolean => {
        return (
          value !== undefined &&
          (value === null || condition(value, args.object))
        );
      },
      defaultMessage: buildMessage(
        (each: string): string => each + `$property ${message}`,
      ),
    },
  });
}
