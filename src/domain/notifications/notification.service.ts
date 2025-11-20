import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Notification } from './entities/notification.entity';
import { SearchNotification } from './dto/search-notification.dto';
import { NotificationAudit } from './entities/notification.entity.audit';
import { UserService } from '../users/user.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class NotificationService extends CrudService<
  Notification,
  NotificationAudit
> {
  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
    @InjectRepository(NotificationAudit)
    protected readonly auditRepository: Repository<NotificationAudit>,
    private readonly userService: UserService,
  ) {
    super(Notification, repository, auditRepository, {
      user: true,
    });
  }

  public async create(input: Notification): Promise<Notification> {
    const user =
      (await this.userService.one({ id: input.user?.id }, {}, false)) ??
      undefined;
    return super.create({ ...input, user });
  }

  public async find(
    criteria: SearchNotification,
  ): Promise<FindOutputDto<Notification>> {
    const where = {
      ...(isDefined(criteria.title) && {
        title: ILike('%' + criteria.title + '%'),
      }),
      ...(isDefined(criteria.body) && {
        body: ILike('%' + criteria.body + '%'),
      }),
      ...(isDefined(criteria.types) && { type: In(criteria.types) }),
      ...(isDefined(criteria.channel) && { channel: criteria.channel }),
      ...(isDefined(criteria.topics) && { topic: In(criteria.topics) }),
      ...(isDefined(criteria.user_id) && { user: { id: criteria.user_id } }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    return this.all(where, criteria, criteria.deleted_at);
  }
}
