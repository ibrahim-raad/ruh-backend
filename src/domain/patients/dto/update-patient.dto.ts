import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UpdateUser } from 'src/domain/users/dto/update-user.dto';
import { UserGender } from 'src/domain/users/shared/user-gender.enum';
import { TherapyMode } from '../shared/therapy-mode.enum';

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
}
