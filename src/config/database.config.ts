import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DatabaseSSLConfig {
  @IsOptional()
  @IsBoolean()
  readonly enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly rejectUnauthorized?: boolean;
}

export class DatabaseConfig {
  @IsNotEmpty()
  @IsString()
  readonly database: string;

  @IsNotEmpty()
  @IsString()
  readonly host: string;

  @IsNotEmpty()
  @IsNumber()
  readonly port: number;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsBoolean()
  readonly synchronize?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DatabaseSSLConfig)
  readonly ssl?: DatabaseSSLConfig;
}
