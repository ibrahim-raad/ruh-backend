import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { UserSpokenLanguage } from './entities/user-spoken-language.entity';
import { UserSpokenLanguageService } from './user-spoken-language.service';
import { UserSpokenLanguageController } from './user-spoken-language.controller';
import { UserSpokenLanguageAudit } from './entities/user-spoken-language.entity.audit';
import { UserSpokenLanguageSubscriber } from './entities/user-spoken-language.entity.subscriber';
import { UserSpokenLanguageMapper } from './user-spoken-language.mapper';
import { UserModule } from '../users/user.module';
import { LanguageModule } from '../languages/language.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSpokenLanguage, UserSpokenLanguageAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
    LanguageModule,
  ],
  providers: [
    UserSpokenLanguageService,
    UserSpokenLanguageSubscriber,
    UserSpokenLanguageMapper,
  ],
  controllers: [UserSpokenLanguageController],
  exports: [UserSpokenLanguageService, UserSpokenLanguageMapper, TypeOrmModule],
})
export class UserSpokenLanguageModule {}
