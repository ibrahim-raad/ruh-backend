import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Language } from './entities/language.entity';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { LanguageAudit } from './entities/language.entity.audit';
import { LanguageSubscriber } from './entities/language.entity.subscriber';
import { LanguageMapper } from './language.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, LanguageAudit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [LanguageService, LanguageSubscriber, LanguageMapper],
  controllers: [LanguageController],
  exports: [LanguageService, LanguageMapper, TypeOrmModule],
})
export class LanguageModule {}
