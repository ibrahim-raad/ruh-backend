import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export const ApiException = <T extends HttpException>(
  exceptions: () => ClassConstructor<T>[],
): ClassDecorator & MethodDecorator => {
  return applyDecorators(
    ...exceptions().map((it) => {
      const instance = new it();
      return ApiResponse({
        status: instance.getStatus(),
        schema: {
          type: 'object',
          required: ['status', 'message'],
          properties: {
            status: {
              type: 'number',
              example: instance.getStatus(),
            },
            error: {
              type: 'string',
              example: instance.message,
            },
            message: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['error message'],
            },
          },
        },
      });
    }),
  );
};
