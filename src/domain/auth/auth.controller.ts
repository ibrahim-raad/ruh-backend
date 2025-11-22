import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/domain/shared/decorators';
import { AuthService } from './auth.service';
import { AuthOutput } from './dto/auth.output';
import { UserMapper } from '../users/user.mapper';
import { SignupUser } from './dto/signup-user.dto';
import { LoginUser } from './dto/login-user.dto';
import { RefreshTokenInput } from './dto/refresh-token.dto';
import { LogoutInput } from './dto/logout.dto';
import { UserOutput } from '../users/dto/user.output';
import { Public } from 'src/guards/decorators/public-route.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { REFRESH_TOKEN_MAX_AGE } from 'src/app.constants';

@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly mapper: UserMapper,
  ) {}

  @Post('signup')
  @Public()
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
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async login(
    @Body() input: LoginUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthOutput> {
    const { user, tokens } = await this.service.login(
      input.email,
      input.password,
    );
    const { access_token, refresh_token } = tokens;
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return {
      user: this.mapper.toOutput(user),
      tokens: {
        access_token,
      },
    };
  }

  @Post('refresh-token')
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const token = req.cookies['refreshToken'] as string;
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const tokens = await this.service.refreshToken(token);
    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    return { accessToken: tokens.access_token };
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const token = req.cookies['refreshToken'] as string;
    if (token) {
      await this.service.logout(token);
    }
    res.cookie('refreshToken', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, UnauthorizedException])
  async me(@CurrentUser() user?: User): Promise<UserOutput> {
    const userId = user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const found = await this.service.me(userId);
    return this.mapper.toOutput(found);
  }
}
