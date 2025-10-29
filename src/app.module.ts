import { DynamicModule, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserContextInterceptor } from './interceptors/user-context.interceptor';
import { RuhTherapyDatabaseModule } from './database/database.module';
import { AppConfig } from './app.config';
import { ConfigModule, registerAs } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { DatabaseConfig } from './config/database.config';
import { LoggerModule } from 'nestjs-pino';
import { LoggerFactory, LoggerFormat } from './lib/logger/logger.factory';
import { ClsModule } from 'nestjs-cls';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({})
export class AppModule {
  static forRoot(config: AppConfig): DynamicModule {
    return {
      global: true,
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          ignoreEnvFile: false,
          load: [
            registerAs<AppConfig>('main', () => config),
            registerAs<DatabaseConfig>('database', () => config.db),
          ],
        }),
        JwtModule.register({
          secret: config.jwt.secret,
          signOptions: { expiresIn: parseInt(config.jwt.expiration) },
        }),
        LoggerModule.forRoot({
          pinoHttp: {
            logger: LoggerFactory({
              format: config.logger.format as LoggerFormat,
              level: config.logger.level,
              mixin: config.logger.mixin || {},
              redact: config.logger.redact,
            }),
            serializers: {
              req(req: any) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                req.body = req.raw?.body;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return req;
              },
            },
          },
          exclude: [{ path: '/swagger', method: RequestMethod.ALL }],
        }),
        ClsModule.forRoot({
          global: true,
          interceptor: { mount: true },
          guard: { mount: true },
          middleware: { mount: true },
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (): JwtModuleOptions => ({
            secret: config.jwt.secret,
            signOptions: {
              expiresIn: parseInt(config.jwt.expiration),
            },
          }),
        }),
        EventEmitterModule.forRoot(),
        RuhTherapyDatabaseModule.forRoot(config.db),
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: UserContextInterceptor,
        },
        JwtStrategy,
      ],
    };
  }
}
