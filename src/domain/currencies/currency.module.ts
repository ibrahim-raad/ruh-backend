import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Currency } from './entities/currency.entity';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { CurrencyAudit } from './entities/currency.entity.audit';
import { CurrencySubscriber } from './entities/currency.entity.subscriber';
import { CurrencyMapper } from './currency.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Currency, CurrencyAudit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [CurrencyService, CurrencySubscriber, CurrencyMapper],
  controllers: [CurrencyController],
  exports: [CurrencyService, CurrencyMapper, TypeOrmModule],
})
export class CurrencyModule {}
