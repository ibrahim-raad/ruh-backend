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
import { UserEmailStatus } from '../users/shared/user-email-status.enum';
import { NotificationService } from '../notifications/notification.service';
import { NotificationType } from '../notifications/shared/notification-type.enum';
import { NotificationChannel } from '../notifications/shared/notification-channel.enum';
import { Notification } from '../notifications/entities/notification.entity';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly passwordStrategy: UserPasswordStrategy,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
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

    if (user.email_status === UserEmailStatus.UNVERIFIED) {
      await this.generateAndSendToken(
        user,
        NotificationType.EMAIL_VERIFICATION,
        'Verify your email',
        'Please verify your email to continue.',
      );
      throw new ForbiddenException(
        'Email not verified. Verification email sent.',
      );
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
    await this.generateAndSendToken(
      user,
      NotificationType.EMAIL_VERIFICATION,
      'Verify your email',
      'Please verify your email to continue.',
    );
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

  public async verifyEmail(token: string): Promise<void> {
    const user = await this.validateToken(token);
    await this.userService.update(user, {
      ...user,
      token: undefined,
      token_expires_at: undefined,
      email_status: UserEmailStatus.VERIFIED,
    });
  }

  public async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.one({ email }, {}, false);
    if (user) {
      await this.generateAndSendToken(
        user,
        NotificationType.RESET_PASSWORD,
        'Reset your password',
        'Please click the link to reset your password.',
      );
    }
  }

  public async resetPassword(token: string, password: string): Promise<void> {
    const user = await this.validateToken(token);
    const hashedPassword = this.passwordStrategy.hash(password);
    await this.userService.update(user, {
      ...user,
      password: hashedPassword,
      token: undefined,
      token_expires_at: undefined,
    });
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload);
  }

  private async generateAndSendToken(
    user: User,
    type: NotificationType,
    title: string,
    body: string,
  ): Promise<void> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    await this.userService.update(user, {
      ...user,
      token: token,
      token_expires_at: expiresAt,
    });
    const notification = Object.assign(new Notification(), {
      type,
      channel: NotificationChannel.EMAIL,
      title,
      body,
      user,
      data: { token },
    });
    await this.notificationService.sendInstant(notification);
  }

  private async validateToken(token: string): Promise<User> {
    const user = await this.userService.one({ token }, {}, false);
    if (!user || !user.token_expires_at || user.token_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }
    return user;
  }
}
