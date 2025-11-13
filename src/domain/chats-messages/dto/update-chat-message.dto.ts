import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChatMessage {
  @IsOptional()
  @IsString()
  readonly message?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
