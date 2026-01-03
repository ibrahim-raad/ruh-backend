import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { UserRole } from '../shared/user-role.enum';
import { UserGender } from '../shared/user-gender.enum';
import { Type } from 'class-transformer';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';
import { UserStatus } from '../shared/user-status.enum';
import { UserEmailStatus } from '../shared/user-email-status.enum';
import { DateStrictRangeInput } from 'src/domain/shared/dto/date-range.dto';

export class SearchUser implements Pageable {
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
  readonly sort: string = 'role ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(UserRole, { each: true })
  readonly roles?: UserRole[];

  @IsOptional()
  @IsEnum(UserGender)
  readonly gender?: UserGender;

  @IsOptional()
  @IsArrayOrSingle()
  @IsEnum(UserStatus, { each: true })
  readonly statuses?: UserStatus[];

  @IsOptional()
  @IsEnum(UserEmailStatus)
  readonly email_status?: UserEmailStatus;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateStrictRangeInput)
  readonly date_of_birth_range?: DateStrictRangeInput;

  @IsOptional()
  @IsUUID()
  readonly country_id?: string;

  @IsOptional()
  @IsUUID()
  readonly language_id?: string;
}
