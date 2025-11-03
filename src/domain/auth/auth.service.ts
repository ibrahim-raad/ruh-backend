import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { RefreshTokenService } from '../refresh-tokens/refresh-token.service';
import { UserPasswordStrategy } from '../users/user-password-strategy.service';
import { UserStatus } from '../users/shared/user-status.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly passwordStrategy: UserPasswordStrategy,
    private readonly jwtService: JwtService,
  ) {}

  public async login(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    tokens: { access_token: string; refresh_token: string };
  }> {
    const user = await this.userService.one({ email }, {}, false);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!this.passwordStrategy.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException('Your Account Has Been Blocked');
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.create(user);
    return {
      user,
      tokens: { access_token: accessToken, refresh_token: refreshToken.token },
    };
  }

  public async signup(input: User): Promise<{
    user: User;
    tokens: { access_token: string; refresh_token: string };
  }> {
    let user: User;
    switch (input.role) {
      case UserRole.PATIENT:
        user = await this.userService.createUserWithPatient(input);
        break;
      case UserRole.THERAPIST:
        user = await this.userService.createUserWithTherapist(input);
        break;
      case UserRole.ADMIN:
        throw new BadRequestException('Admin signup is not allowed');
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.refreshTokenService.create(user);
    return {
      user,
      tokens: { access_token: accessToken, refresh_token: refreshToken.token },
    };
  }

  public async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const token =
      await this.refreshTokenService.validateRevokeAndRenew(refreshToken);
    const accessToken = await this.generateAccessToken(token.user);
    return {
      access_token: accessToken,
      refresh_token: token.token,
    };
  }

  public async logout(token: string): Promise<void> {
    await this.refreshTokenService.revokeToken(token);
  }

  public async me(userId: string): Promise<User> {
    return await this.userService.one({ id: userId });
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload);
  }
}
