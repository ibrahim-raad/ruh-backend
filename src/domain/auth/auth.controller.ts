import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/domain/shared/decorators';
import { AuthService } from './auth.service';
import { AuthOutput } from './dto/auth.output';
import { UserMapper } from '../users/user.mapper';
import { SignupUser } from './dto/signup-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { RefreshTokenInput } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly mapper: UserMapper,
  ) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async signup(@Body() input: SignupUser): Promise<AuthOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.signup(entity);
    const user = this.mapper.toOutput(created.user);
    return {
      user,
      tokens: created.tokens,
    };
  }

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async login(@Body() input: LoginUser): Promise<AuthOutput> {
    const tokens = await this.service.login(input.email, input.password);
    return {
      user: this.mapper.toOutput(tokens.user),
      tokens: tokens.tokens,
    };
  }

  @Post('refresh-token')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async refreshToken(
    @Body() input: RefreshTokenInput,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const tokens = await this.service.refreshToken(input.token);
    return tokens;
  }
}
