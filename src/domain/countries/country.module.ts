import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { Country } from './entities/country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryAudit } from './entities/country.entity.audit';
import { CountrySubscriber } from './entities/country.entity.subscriber';
import { CountryMapper } from './country.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, CountryAudit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [CountryService, CountrySubscriber, CountryMapper],
  controllers: [CountryController],
  exports: [CountryService, CountryMapper, TypeOrmModule],
})
export class CountryModule {}
