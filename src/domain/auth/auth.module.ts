import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshTokenModule } from '../refresh-tokens/refresh-token.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UserModule, RefreshTokenModule, JwtModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
