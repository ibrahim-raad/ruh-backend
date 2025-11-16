import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentAudit } from './entities/payment.entity.audit';
import { PaymentSubscriber } from './entities/payment.entity.subscriber';
import { PaymentMapper } from './payment.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentAudit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [PaymentService, PaymentSubscriber, PaymentMapper],
  controllers: [PaymentController],
  exports: [PaymentService, PaymentMapper, TypeOrmModule],
})
export class PaymentModule {}
