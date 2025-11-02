import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Admin } from './entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminAudit } from './entities/admin.entity.audit';
import { AdminSubscriber } from './entities/admin.entity.subscriber';
import { AdminMapper } from './admin.mapper';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminAudit]),
    ClsModule,
    EventEmitterModule,
    UserModule,
  ],
  providers: [AdminService, AdminSubscriber, AdminMapper],
  controllers: [AdminController],
  exports: [AdminService, AdminMapper, TypeOrmModule],
})
export class AdminModule {}
