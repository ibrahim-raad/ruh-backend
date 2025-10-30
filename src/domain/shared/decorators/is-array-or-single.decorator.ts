import { isArray, IsArray, ValidationOptions } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function IsArrayOrSingle<T>(
  options?: ValidationOptions,
): PropertyDecorator {
  return applyDecorators(
    Transform(({ value }) => {
      if (isArray(value)) {
        return value as T[];
      }
      if (typeof value === 'string') {
        return value.split(',') as T[];
      }
      return [value] as T[];
    }),
    IsArray(options),
  );
}
