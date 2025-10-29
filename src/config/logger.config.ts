import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import pino from 'pino';
import * as loggerFactory from '../lib/logger/logger.factory';

export class LoggerConfig {
  @IsNotEmpty()
  @IsString()
  readonly level: pino.Level;

  @IsNotEmpty()
  @IsString()
  readonly format: loggerFactory.LoggerFormat;

  @IsOptional()
  readonly mixin?: Record<string, string>;

  @IsArray()
  @ArrayNotEmpty()
  readonly redact: string[];
}
