import {
  buildMessage,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { compareToField } from '../../../utils';

export function Match(
  reference: string,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'Match',
      constraints: [reference],
      validator: {
        validate: (value: number, args: ValidationArguments): boolean => {
          return compareToField(value, reference, args.object);
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property and $constraint1 does not match',
          options,
        ),
      },
    },
    options,
  );
}
