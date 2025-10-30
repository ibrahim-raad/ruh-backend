import {
  buildMessage,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isAfter } from '../../../utils';

export function IsAfter(
  reference: string | Date | number,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsAfter',
      constraints: [reference],
      validator: {
        validate: (value: Date, args: ValidationArguments): boolean => {
          return isAfter(value, reference, args.object);
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must be after $constraint1',
          options,
        ),
      },
    },
    options,
  );
}
