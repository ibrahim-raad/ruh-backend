import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ChatMessageType } from '../shared/chat-message-type.enum';

export class CreateChatMessage {
  @IsOptional()
  @IsString()
  readonly message?: string;

  @IsNotEmpty()
  @IsEnum(ChatMessageType)
  readonly type: ChatMessageType;

  @IsOptional()
  @IsUUID()
  readonly reply_to_id?: string;
}
