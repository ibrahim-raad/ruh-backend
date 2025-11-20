import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { SessionChat } from './entities/session-chat.entity';
import { SearchSessionChat } from './dto/search-session-chat.dto';
import { SessionChatAudit } from './entities/session-chat.entity.audit';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/shared/user-role.enum';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class SessionChatService extends CrudService<
  SessionChat,
  SessionChatAudit
> {
  constructor(
    @InjectRepository(SessionChat)
    protected readonly repository: Repository<SessionChat>,
    @InjectRepository(SessionChatAudit)
    protected readonly auditRepository: Repository<SessionChatAudit>,
  ) {
    super(SessionChat, repository, auditRepository, {
      session: {
        therapy_case: {
          therapist: {
            user: true,
          },
          patient: {
            user: true,
          },
        },
      },
      user: true,
    });
  }

  public async find(
    criteria: SearchSessionChat,
    session_id: string,
    user: User,
  ): Promise<FindOutputDto<SessionChat>> {
    const accessCondition = this.getAccessCondition(user, session_id);

    const where = {
      ...(isDefined(criteria.message) && {
        message: ILike('%' + criteria.message + '%'),
      }),
      session: {
        id: session_id,
        ...accessCondition,
      },
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }

  public getAccessCondition(
    user: User,
    session_id: string,
  ): Record<string, any> {
    let accessCondition: Record<string, any> = {};

    switch (user.role) {
      case UserRole.ADMIN:
        break;
      case UserRole.THERAPIST:
        accessCondition = {
          session: {
            id: session_id,
            therapy_case: {
              therapist: {
                user: { id: user.id },
              },
            },
          },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          session: {
            id: session_id,
            therapy_case: {
              patient: {
                user: { id: user.id },
              },
            },
          },
        };
        break;
    }

    return accessCondition;
  }
}
