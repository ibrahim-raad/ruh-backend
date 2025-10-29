import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';
import { extractMessage } from './extract-messages';

type ErrorConstructor = (errors: string[], message) => Error;

export function validateOrThrow<T, V>(
  klass: ClassConstructor<T>,
  plain: any,
  errorFn: ErrorConstructor = (_, message: string) => new Error(message),
) {
  const errors = validateSync(plainToInstance<T, V>(klass, plain));
  if (errors.length === 0) {
    return plain as T;
  }
  const errorsFlatten = errors.reduce<string[]>(
    (a, it) => a.concat(extractMessage(it).flat()),
    [],
  );
  throw errorFn(errorsFlatten, `\n\t* ${errorsFlatten.join(`\n\t* `)}\n`);
}

export function validateFor<T>(
  klass: ClassConstructor<T>,
  errorFn?: ErrorConstructor,
): (value: any) => T {
  return (value) => validateOrThrow(klass, value, errorFn);
}
