import {
  buildMessage,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { isBigger } from '../../../utils';

export function IsBigger(
  reference: string | number,
  options?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsBigger',
      constraints: [reference],
      validator: {
        validate: (value: number, args: ValidationArguments): boolean => {
          return isBigger(value, reference, args.object);
        },
        defaultMessage: buildMessage(
          (each: string): string =>
            each + '$property must be bigger than $constraint1',
          options,
        ),
      },
    },
    options,
  );
}
