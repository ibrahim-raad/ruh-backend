import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenModule } from '../refresh-tokens/refresh-token.module';
import { UserModule } from '../users/user.module';
import { NotificationModule } from '../notifications/notification.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/app.config';
import type { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    NotificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mainConfig = configService.get<AppConfig>('main');
        return {
          secret: mainConfig?.jwt?.secret,
          signOptions: {
            expiresIn: mainConfig?.jwt?.expiration as SignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
