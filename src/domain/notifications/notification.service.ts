import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Notification } from './entities/notification.entity';
import { SearchNotification } from './dto/search-notification.dto';
import { NotificationAudit } from './entities/notification.entity.audit';
import { UserService } from '../users/user.service';
import { FindOutputDto } from '../shared/dto/find-output,dto';
import { ResendEmailProvider } from './providers/resend-email.provider';
import { NotificationChannel } from './shared/notification-channel.enum';

@Injectable()
export class NotificationService extends CrudService<
  Notification,
  NotificationAudit
> {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    protected readonly repository: Repository<Notification>,
    @InjectRepository(NotificationAudit)
    protected readonly auditRepository: Repository<NotificationAudit>,
    private readonly userService: UserService,
    private readonly resendEmailProvider: ResendEmailProvider,
  ) {
    super(Notification, repository, auditRepository, {
      user: true,
    });
  }

  public async create(input: Notification): Promise<Notification> {
    const user =
      (await this.userService.one({ id: input.user?.id }, {}, false)) ??
      undefined;
    const notification = await super.create({ ...input, user });

    if (user) {
      this.sendNotification(notification).catch((err) => {
        this.logger.error('Error sending notification', err);
      });
    }

    return notification;
  }

  public async sendInstant(input: Notification): Promise<void> {
    const user = input.user?.id
      ? await this.userService.one({ id: input.user?.id })
      : undefined;
    if (user) {
      this.sendNotification({ ...input, user }).catch((err) => {
        this.logger.error('Error sending notification', err);
        throw new BadRequestException('Error sending notification');
      });
    }
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

  private async sendNotification(notification: Notification) {
    this.logger.log(`Sending notification: ${JSON.stringify(notification)}`);
    switch (notification.channel) {
      case NotificationChannel.EMAIL:
        await this.resendEmailProvider.send(notification);
        break;
      case NotificationChannel.PUSH:
        // await this.pushNotificationProvider.send(notification);
        break;
    }
  }
}
