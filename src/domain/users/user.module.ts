import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAudit } from './entities/user.entity.audit';
import { UserSubscriber } from './entities/user.entity.subscriber';
import { UserMapper } from './user.mapper';
import { CountryModule } from '../countries/country.module';
import { UserPasswordStrategy } from './user-password-strategy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAudit]),
    ClsModule,
    EventEmitterModule,
    CountryModule,
  ],
  providers: [UserService, UserSubscriber, UserMapper, UserPasswordStrategy],
  controllers: [UserController],
  exports: [UserService, UserMapper, TypeOrmModule, UserPasswordStrategy],
})
export class UserModule {}
