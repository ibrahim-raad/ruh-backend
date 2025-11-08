import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { IsArrayOrSingle } from 'src/domain/shared/decorators/is-array-or-single.decorator';

export class SearchTherapistSpecialization implements Pageable {
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
  readonly sort: string =
    'therapist.user.full_name ASC, specialization.name ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsArrayOrSingle()
  @IsUUID(undefined, { each: true })
  readonly therapist_ids?: string[];

  @IsOptional()
  @IsArrayOrSingle()
  @IsUUID(undefined, { each: true })
  readonly specialization_ids?: string[];

  @IsOptional()
  @IsString()
  readonly specialization_name?: string;
}
