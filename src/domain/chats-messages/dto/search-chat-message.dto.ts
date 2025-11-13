import {
  IsEnum,
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
import { ChatMessageType } from '../shared/chat-message-type.enum';

export class SearchChatMessage implements Pageable {
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
  readonly sort: string = 'message ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly message?: string;

  @IsOptional()
  @IsEnum(ChatMessageType)
  readonly types?: ChatMessageType[];

  @IsOptional()
  @IsUUID()
  readonly reply_to_id?: string;

  @IsOptional()
  @IsBooleanish()
  readonly with_therapy_case?: boolean = false;

  @IsOptional()
  @IsBooleanish()
  readonly with_user?: boolean = false;
}
