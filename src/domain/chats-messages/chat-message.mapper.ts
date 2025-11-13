import { BadRequestException, Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateChatMessage } from './dto/create-chat-message.dto';
import { ChatMessage } from './entities/chat-message.entity';
import { UpdateChatMessage } from './dto/update-chat-message.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { ChatMessageOutput } from './dto/chat-message.output';
import { TherapyCaseMapper } from '../therapy-cases/therapy-case.mapper';
import { UserMapper } from '../users/user.mapper';
import { ChatMessageType } from './shared/chat-message-type.enum';

@Injectable()
export class ChatMessageMapper {
  constructor(
    private readonly therapyCaseMapper: TherapyCaseMapper,
    private readonly userMapper: UserMapper,
  ) {}
  public toModel(
    input: CreateChatMessage & { therapyCaseId: string },
  ): ChatMessage;

  public toModel(input: UpdateChatMessage, existing: ChatMessage): ChatMessage;

  public toModel(
    input: (CreateChatMessage & { therapyCaseId: string }) | UpdateChatMessage,
    existing?: ChatMessage,
  ): ChatMessage {
    let data = {};

    if (input instanceof UpdateChatMessage) {
      if (isDefined(input.version) && isDefined(existing?.version)) {
        if (!isEqual(input.version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      if (isDefined(input.message) && existing?.type !== ChatMessageType.TEXT) {
        throw new BadRequestException('Message type must be text');
      }
      data = {
        message: input.message ?? existing?.message,
      };
    } else {
      data = {
        message: input.message,
        type: input.type,
        reply_to: input.reply_to_id ? { id: input.reply_to_id } : undefined,
        therapy_case: { id: input.therapyCaseId },
      };
    }
    return Object.assign(new ChatMessage(), existing ?? {}, data);
  }

  public toOutput(input: ChatMessage): ChatMessageOutput {
    return Object.assign(new ChatMessageOutput(), {
      id: input.id,
      message: input.message,
      type: input.type,
      reply_to_id: input.replyToId,
      received_at: input.received_at,
      reply_to: input.reply_to ? this.toOutput(input.reply_to) : undefined,
      therapy_case: input.therapy_case
        ? this.therapyCaseMapper.toOutput(input.therapy_case)
        : undefined,
      therapy_case_id: input.therapyCaseId,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
      user_id: input.userId,
      seen_at: input.seen_at,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
