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

export class SearchUserSpokenLanguage implements Pageable {
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
  @IsUUID()
  readonly user_id?: string;

  @IsOptional()
  @IsUUID()
  readonly language_id?: string;

  @IsOptional()
  @IsBooleanish()
  readonly is_primary?: boolean;

  @IsOptional()
  @IsArrayOrSingle()
  @IsUUID(undefined, { each: true })
  readonly language_ids?: string[];

  @IsOptional()
  @IsArrayOrSingle()
  @IsUUID(undefined, { each: true })
  readonly user_ids?: string[];
}
