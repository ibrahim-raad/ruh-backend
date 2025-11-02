import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { UserGender } from 'src/domain/users/shared/user-gender.enum';
import { TherapyMode } from '../shared/therapy-mode.enum';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';
import { SearchUser } from 'src/domain/users/dto/search-user.dto';

export class SearchPatient extends SearchUser implements Pageable {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'user.full_name ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly user_id?: string;

  @IsOptional()
  @IsEnum(UserGender)
  readonly preferred_therapist_gender?: UserGender;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(TherapyMode, { each: true })
  readonly preferred_therapy_modes?: TherapyMode[];
}
