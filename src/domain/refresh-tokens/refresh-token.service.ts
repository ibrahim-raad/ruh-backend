import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  public async create(user: User): Promise<RefreshToken> {
    const token = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const refreshToken = this.repository.create({
      user,
      token,
      expires_at: expiresAt,
    });
    return this.repository.save(refreshToken);
  }

  public async validateRevokeAndRenew(token: string): Promise<RefreshToken> {
    const oldToken = await this.repository.findOne({
      where: { token },
      relations: { user: true },
    });
    if (!oldToken || oldToken.expires_at < new Date()) {
      throw new UnauthorizedException('Token is expired or invalid');
    }
    if (oldToken.revoked) {
      await this.revokeAllSessions(oldToken.userId);
      throw new UnauthorizedException('Token has been reused');
    }
    await this.revokeToken(oldToken.token);
    const newToken = await this.create(oldToken.user);
    return newToken;
  }

  private async revokeAllSessions(userId: string): Promise<void> {
    await this.repository.update(
      { user: { id: userId } },
      { revoked: true, revoked_at: new Date() },
    );
  }

  public async revokeToken(token: string): Promise<void> {
    await this.repository.update(
      { token },
      { revoked: true, revoked_at: new Date() },
    );
  }
}
