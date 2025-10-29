import {
  IsNotEmpty,
  IsNumber,
  IsSemVer,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DatabaseConfig } from './config/database.config';
import { LoggerConfig } from './config/logger.config';
import { SwaggerConfig } from './config/swagger.config';
import { JwtConfig } from './config/jwt.config';

export class AppConfig {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly port: number;

  @IsString()
  @IsSemVer()
  readonly version: string;

  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly logger: LoggerConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  readonly db: DatabaseConfig;

  @ValidateNested()
  @Type(() => SwaggerConfig)
  readonly swagger: SwaggerConfig;

  @ValidateNested()
  @Type(() => JwtConfig)
  readonly jwt: JwtConfig;
}
