import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../../domain/countries/entities/country.entity';
import { Language } from '../../domain/languages/entities/language.entity';
import { Specialization } from '../../domain/specializations/entities/specialization.entity';
import { User } from '../../domain/users/entities/user.entity';
import { Admin } from '../../domain/admins/entities/admin.entity';
import { UserPasswordStrategy } from '../../domain/users/user-password-strategy.service';
import { countries } from './data/countries.data';
import { languages } from './data/languages.data';
import { specializations } from './data/specializations.data';
import { UserRole } from '../../domain/users/shared/user-role.enum';
import { AdminRole } from '../../domain/admins/shared/admin-role.enum';
import { UserStatus } from '../../domain/users/shared/user-status.enum';
import { UserEmailStatus } from '../../domain/users/shared/user-email-status.enum';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly passwordStrategy: UserPasswordStrategy,
  ) {}

  async seed() {
    await this.seedCountries();
    await this.seedLanguages();
    await this.seedSpecializations();
    await this.seedAdmin();
  }

  private async seedCountries() {
    for (const countryData of countries) {
      const existing = await this.countryRepository.findOneBy({
        name: countryData.name,
      });
      if (!existing) {
        await this.countryRepository.save(
          this.countryRepository.create(countryData),
        );
        this.logger.log(`Seeded country: ${countryData.name}`);
      }
    }
  }

  private async seedLanguages() {
    for (const languageData of languages) {
      const existing = await this.languageRepository.findOneBy({
        code: languageData.code,
      });
      if (!existing) {
        await this.languageRepository.save(
          this.languageRepository.create(languageData),
        );
        this.logger.log(`Seeded language: ${languageData.name}`);
      }
    }
  }

  private async seedSpecializations() {
    for (const specData of specializations) {
      const existing = await this.specializationRepository.findOneBy({
        name: specData.name,
      });
      if (!existing) {
        await this.specializationRepository.save(
          this.specializationRepository.create(specData),
        );
        this.logger.log(`Seeded specialization: ${specData.name}`);
      }
    }
  }

  private async seedAdmin() {
    const email = 'admin@ruh.com';
    const existingUser = await this.userRepository.findOneBy({ email });

    if (!existingUser) {
      const user = this.userRepository.create({
        full_name: 'Super Admin',
        email,
        password: this.passwordStrategy.hash('Password123!'),
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        email_status: UserEmailStatus.VERIFIED,
      });

      const savedUser = await this.userRepository.save(user);

      const admin = this.adminRepository.create({
        user: savedUser,
        admin_role: AdminRole.SUPER_ADMIN,
      });

      await this.adminRepository.save(admin);
      this.logger.log(`Seeded admin: ${email}`);
    } else {
      const adminProfile = await this.adminRepository.findOneBy({
        user: { id: existingUser.id },
      });
      if (!adminProfile) {
        const admin = this.adminRepository.create({
          user: existingUser,
          admin_role: AdminRole.SUPER_ADMIN,
        });
        await this.adminRepository.save(admin);
        this.logger.log(`Seeded admin profile for existing user: ${email}`);
      }
    }
  }
}
