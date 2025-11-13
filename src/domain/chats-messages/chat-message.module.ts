import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageAudit } from './entities/chat-message.entity.audit';
import { ChatMessageSubscriber } from './entities/chat-message.entity.subscriber';
import { ChatMessageMapper } from './chat-message.mapper';
import { TherapyCaseModule } from '../therapy-cases/therapy-case.module';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, ChatMessageAudit]),
    ClsModule,
    EventEmitterModule,
    TherapyCaseModule,
    UserModule,
  ],
  providers: [ChatMessageService, ChatMessageSubscriber, ChatMessageMapper],
  controllers: [ChatMessageController],
  exports: [ChatMessageService, ChatMessageMapper, TypeOrmModule],
})
export class ChatMessageModule {}
