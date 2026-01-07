import { IsNotEmpty, IsNumber } from 'class-validator';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class UpdateUserSpokenLanguage {
  @IsNotEmpty()
  @IsBooleanish()
  readonly is_primary: boolean;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
