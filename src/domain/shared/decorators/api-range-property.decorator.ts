import { applyDecorators } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { ApiExtraModels, ApiQuery, getSchemaPath } from '@nestjs/swagger';

export function ApiNestedQuery({
  name,
  type,
  required,
}: {
  name: string;
  type: ClassConstructor<any>;
  required?: boolean;
}) {
  return applyDecorators(
    ApiExtraModels(type),
    ApiQuery({
      required: required === true,
      name,
      style: 'deepObject',
      explode: true,
      type: 'object',
      schema: {
        $ref: getSchemaPath(type),
      },
    }),
  );
}
