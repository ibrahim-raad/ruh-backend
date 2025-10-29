import { INestApplication } from '@nestjs/common';
import { defaultPipes } from './pipes';
import { defaultFilters } from './filters';
import { defaultInterceptors } from './interceptors';
import { bodyParser } from './middlewares/body-parser.middleware';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guard';
import helmet from 'helmet';

export const useGlobalDefaults = (app: INestApplication) => {
  // Setting global pipes
  app.useGlobalPipes(...defaultPipes);
  app.use(bodyParser(/webhooks/));

  // Setting global filters
  app.useGlobalFilters(...defaultFilters);

  // Setting global interceptors
  app.useGlobalInterceptors(...defaultInterceptors);

  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());

  // TODO: Uncomment this when we have a compression middleware
  // app.use(compression());
  app.enableShutdownHooks();
};
