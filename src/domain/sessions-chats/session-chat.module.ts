import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { SessionChat } from './entities/session-chat.entity';
import { SessionChatService } from './session-chat.service';
import { SessionChatController } from './session-chat.controller';
import { SessionChatAudit } from './entities/session-chat.entity.audit';
import { SessionChatSubscriber } from './entities/session-chat.entity.subscriber';
import { SessionChatMapper } from './session-chat.mapper';
import { SessionModule } from '../sessions/session.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionChat, SessionChatAudit]),
    ClsModule,
    EventEmitterModule,
    SessionModule,
    UserModule,
  ],
  providers: [SessionChatService, SessionChatSubscriber, SessionChatMapper],
  controllers: [SessionChatController],
  exports: [SessionChatService, SessionChatMapper, TypeOrmModule],
})
export class SessionChatModule {}
