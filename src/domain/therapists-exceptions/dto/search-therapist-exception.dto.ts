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

export class SearchTherapistException implements Pageable {
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
  readonly sort: string = 'date ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly date?: Date;

  @IsOptional()
  @IsBooleanish()
  readonly is_available?: boolean = true;

  @IsOptional()
  @IsUUID()
  readonly therapist_id?: string;
}
