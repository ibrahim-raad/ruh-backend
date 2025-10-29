import { ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

const options: ValidationPipeOptions = {
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
    exposeUnsetFields: false,
  },
  whitelist: true,
};

export const ValidationFactory = {
  createGlobal: () => new ValidationPipe(options),
};
