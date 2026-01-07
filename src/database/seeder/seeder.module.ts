import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Country } from '../../domain/countries/entities/country.entity';
import { Language } from '../../domain/languages/entities/language.entity';
import { Specialization } from '../../domain/specializations/entities/specialization.entity';
import { User } from '../../domain/users/entities/user.entity';
import { Admin } from '../../domain/admins/entities/admin.entity';
import { UserModule } from '../../domain/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Language, Specialization, User, Admin]),
    UserModule,
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
