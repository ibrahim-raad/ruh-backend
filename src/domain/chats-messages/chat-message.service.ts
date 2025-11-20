import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { ChatMessage } from './entities/chat-message.entity';
import { SearchChatMessage } from './dto/search-chat-message.dto';
import { ChatMessageAudit } from './entities/chat-message.entity.audit';
import { UserService } from '../users/user.service';
import { TherapyCaseService } from '../therapy-cases/therapy-case.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class ChatMessageService extends CrudService<
  ChatMessage,
  ChatMessageAudit
> {
  constructor(
    @InjectRepository(ChatMessage)
    protected readonly repository: Repository<ChatMessage>,
    @InjectRepository(ChatMessageAudit)
    protected readonly auditRepository: Repository<ChatMessageAudit>,
    private readonly therapyCaseService: TherapyCaseService,
    private readonly userService: UserService,
  ) {
    super(ChatMessage, repository, auditRepository, {
      reply_to: true,
    });
  }

  public async create(input: ChatMessage): Promise<ChatMessage> {
    const therapyCase = await this.therapyCaseService.one({
      id: input.therapy_case.id,
    });
    const user = await this.userService.one({ id: input.user.id });
    const replyTo = input.reply_to
      ? await this.one({ id: input.reply_to.id })
      : undefined;
    const message = Object.assign(new ChatMessage(), input, {
      therapy_case: therapyCase,
      user,
      reply_to: replyTo,
    });
    return super.create(message);
  }

  public async find(
    criteria: SearchChatMessage,
    therapyCaseId: string,
    user: User,
  ): Promise<FindOutputDto<ChatMessage>> {
    const accessCondition = this.getAccessCondition(user, therapyCaseId);
    const where = {
      ...(isDefined(criteria.message) && {
        message: ILike('%' + criteria.message + '%'),
      }),
      ...(isDefined(criteria.types) && { type: In(criteria.types) }),
      ...(isDefined(criteria.reply_to_id) && {
        reply_to: { id: criteria.reply_to_id },
      }),
      ...accessCondition,
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at, {
      ...(criteria.with_therapy_case && { therapy_case: true }),
      ...(criteria.with_user && { user: true }),
    });
  }

  public getAccessCondition(
    user: User,
    therapyCaseId: string,
  ): Record<string, any> {
    let accessCondition: Record<string, any> = {};

    switch (user.role) {
      case UserRole.ADMIN:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
          },
        };
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            therapist: { user: { id: user.id } },
          },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          therapy_case: {
            id: therapyCaseId,
            patient: { user: { id: user.id } },
          },
        };
        break;
    }
    return accessCondition;
  }
}
