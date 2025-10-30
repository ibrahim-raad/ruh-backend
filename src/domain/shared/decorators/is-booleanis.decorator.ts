import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  buildMessage,
  isBoolean,
  isDefined,
  ValidateBy,
} from 'class-validator';

export function IsBooleanish(): PropertyDecorator {
  return applyDecorators(
    Type(() => String),
    Transform(({ value }: TransformFnParams) => {
      if (!isDefined(value)) return undefined;
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value?.toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
      }
      return undefined;
    }),
    ValidateBy({
      name: 'IsBooleanish',
      validator: {
        validate: (value: any) => isBoolean(value),
        defaultMessage: buildMessage(
          (each: string): string => each + '$property must be a boolean value',
        ),
      },
    }),
  );
}
