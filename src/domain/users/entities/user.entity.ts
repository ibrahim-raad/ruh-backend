import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { UserRole } from '../shared/user-role.enum';
import { UserStatus } from '../shared/user-status.enum';
import { UserGender } from '../shared/user-gender.enum';
import { UserEmailStatus } from '../shared/user-email-status.enum';
import { Country } from 'src/domain/countries/entities/country.entity';
import { Type } from 'class-transformer';

@Entity('users')
@Index(['email'])
@Index(['full_name'])
@Index(['role'])
@Index(['gender'])
export class User extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  full_name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255 })
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  @Column({ nullable: false, type: 'enum', enum: UserRole })
  role: UserRole;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus = UserStatus.PENDING;

  @IsNotEmpty()
  @IsEnum(UserGender)
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserGender,
    default: UserGender.UNKNOWN,
  })
  gender: UserGender = UserGender.UNKNOWN;

  @IsNotEmpty()
  @IsEnum(UserEmailStatus)
  @Column({
    nullable: false,
    type: 'enum',
    enum: UserEmailStatus,
    default: UserEmailStatus.UNVERIFIED,
  })
  email_status: UserEmailStatus = UserEmailStatus.UNVERIFIED;

  @IsNotEmpty()
  @ManyToOne(() => Country, {
    nullable: true,
    cascade: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  @RelationId((user: User) => user.country)
  countryId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  date_of_birth?: Date;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  profile_url?: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 6 })
  otp?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ nullable: true, type: 'timestamp' })
  otp_expires_at?: Date;
}
