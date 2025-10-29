import { ExcludeNullInterceptor } from './exclude-null.interceptor';
import { LoggerErrorInterceptor } from 'nestjs-pino';

export * from './exclude-null.interceptor';

export const defaultInterceptors = [
  new ExcludeNullInterceptor(),
  new LoggerErrorInterceptor(),
];
