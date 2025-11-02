import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class CreateUserSpokenLanguage {
  @IsNotEmpty()
  @IsUUID()
  readonly language_id: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_primary: boolean = false;
}
