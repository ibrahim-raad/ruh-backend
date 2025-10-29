import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SwaggerConfig {
  @IsNotEmpty()
  @IsString()
  readonly path: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsArray()
  @ArrayNotEmpty()
  readonly tags: string[];
}
