import {
  buildMessage,
  isDefined,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isUndefined } from 'util';

export function IsOptionalInCase(
  reference: any,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsOptionalInCase',
      constraints: [reference],
      validator: {
        validate: (value: any, args: ValidationArguments): boolean => {
          return isDefined(value);
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must be optional in case $constraint1 is defined',
          options,
        ),
      },
    },
    options,
  );
}
