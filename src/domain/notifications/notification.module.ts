import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationAudit } from './entities/notification.entity.audit';
import { NotificationSubscriber } from './entities/notification.entity.subscriber';
import { NotificationMapper } from './notification.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
  ],
  providers: [NotificationService, NotificationSubscriber, NotificationMapper],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationMapper, TypeOrmModule],
})
export class NotificationModule {}
