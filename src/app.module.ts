import { DynamicModule, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserContextInterceptor } from './interceptors/user-context.interceptor';
import { RuhTherapyDatabaseModule } from './database/database.module';
import { AppConfig } from './app.config';
import { ConfigModule, registerAs } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { LoggerModule } from 'nestjs-pino';
import { LoggerFactory } from './lib/logger/logger.factory';
import { ClsModule } from 'nestjs-cls';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtStrategy } from './guards/jwt.strategy';
import { CountryModule } from './domain/countries/country.module';
import { LanguageModule } from './domain/languages/language.module';
import { SpecializationModule } from './domain/specializations/specialization.module';
import { UserModule } from './domain/users/user.module';
import { RefreshTokenModule } from './domain/refresh-tokens/refresh-token.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserSpokenLanguageModule } from './domain/users-spoken-languages/user-spoken-language.module';
import { AdminModule } from './domain/admins/admin.module';
import { PatientModule } from './domain/patients/patient.module';
import { CurrencyModule } from './domain/currencies/currency.module';
import { TherapistModule } from './domain/therapists/therapist.module';
import { QuestionnaireModule } from './domain/questionnaires/questionnaire.module';
import { QuestionModule } from './domain/questions/question.module';
import { PossibleAnswerModule } from './domain/possible-answers/possible-answer.module';
import { TherapistSpecializationModule } from './domain/therapists-specializations/therapist-specialization.module';
import { TherapistSettingsModule } from './domain/therapists-settings/therapist-settings.module';
import { TherapistAvailabilityModule } from './domain/therapists-availability/therapist-availability.module';
import { TherapistExceptionModule } from './domain/therapists-exceptions/therapist-exception.module';
import { ReflectionModule } from './domain/reflections/reflection.module';
import { ExerciseModule } from './domain/exercises/exercise.module';

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

        LoggerModule.forRoot({
          pinoHttp: {
            logger: LoggerFactory({
              format: config.logger.format,
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

        EventEmitterModule.forRoot(),
        RuhTherapyDatabaseModule.forRoot(config.db),
        CountryModule,
        LanguageModule,
        SpecializationModule,
        UserModule,
        RefreshTokenModule,
        AuthModule,
        UserSpokenLanguageModule,
        AdminModule,
        PatientModule,
        CurrencyModule,
        TherapistModule,
        QuestionnaireModule,
        QuestionModule,
        PossibleAnswerModule,
        TherapistSpecializationModule,
        TherapistSettingsModule,
        TherapistAvailabilityModule,
        TherapistExceptionModule,
        ReflectionModule,
        ExerciseModule,
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
