import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';
import { IsBooleanish } from 'src/domain/shared/decorators';

@Entity('refresh_tokens')
@Index(['token'])
@Index(['user'])
export class RefreshToken extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  token: string;

  @IsNotEmpty()
  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((refreshToken: RefreshToken) => refreshToken.user)
  userId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: false, type: 'timestamp' })
  expires_at: Date;

  @IsNotEmpty()
  @IsBooleanish()
  @Column({ nullable: false, default: false })
  revoked: boolean;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  revoked_at?: Date;
}
