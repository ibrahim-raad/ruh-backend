import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { UserSpokenLanguage } from './user-spoken-language.entity';
import { UserSpokenLanguageAudit } from './user-spoken-language.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { UserSpokenLanguageAuditTopic } from '../shared/user-spoken-language-topic.enum';

@Injectable()
@EventSubscriber()
export class UserSpokenLanguageSubscriber extends CrudSubscriber<
  UserSpokenLanguage,
  UserSpokenLanguageAudit
> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      UserSpokenLanguage,
      UserSpokenLanguageAudit,
      UserSpokenLanguageAuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
