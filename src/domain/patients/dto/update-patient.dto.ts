import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateUser } from 'src/domain/users/dto/update-user.dto';
import { UserGender } from 'src/domain/users/shared/user-gender.enum';
import { TherapyMode } from '../shared/therapy-mode.enum';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';
import { Type } from 'class-transformer';
import { CreateUserSpokenLanguage } from 'src/domain/users-spoken-languages/dto/create-user-spoken-language.dto';

export class UpdatePatient extends UpdateUser {
  @IsOptional()
  @IsString()
  readonly provider_customer_id?: string;

  @IsOptional()
  @IsEnum(UserGender)
  readonly preferred_therapist_gender?: UserGender;

  @IsOptional()
  @IsEnum(TherapyMode)
  readonly preferred_therapy_mode?: TherapyMode;

  @IsNotEmpty()
  @IsNumber()
  readonly patient_version: number;

  @IsOptional()
  @IsArrayOrSingle()
  @ValidateNested({ each: true })
  @Type(() => CreateUserSpokenLanguage)
  readonly spoken_languages?: CreateUserSpokenLanguage[];
}
