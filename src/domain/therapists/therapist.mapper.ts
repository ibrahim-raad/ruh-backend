import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { Therapist } from './entities/therapist.entity';
import { UpdateTherapist } from './dto/update-therapist.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { TherapistOutput } from './dto/therapist.output';
import { UserMapper } from '../users/user.mapper';
import { CurrencyMapper } from '../currencies/currency.mapper';
import { TherapistSpecialization } from '../therapists-specializations/entities/therapist-specialization.entity';
import { SpecializationOutput } from '../specializations/dto/specialization.output';

@Injectable()
export class TherapistMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly currencyMapper: CurrencyMapper,
  ) {}
  public toModel(input: UpdateTherapist, existing: Therapist): Therapist {
    if (isDefined(input.therapist_version) && isDefined(existing?.version)) {
      if (!isEqual(input.therapist_version, existing?.version)) {
        throw new ConflictUpdateError();
      }
    }
    const data = {
      bio: input.bio ?? existing?.bio,
      years_of_experience:
        input.years_of_experience ?? existing?.years_of_experience,
      rate_per_hour: input.rate_per_hour ?? existing?.rate_per_hour,
      currency: input.currency_id
        ? { id: input.currency_id }
        : existing?.currency,
      is_psychiatrist: input.is_psychiatrist ?? existing?.is_psychiatrist,
      license_number: input.license_number ?? existing?.license_number,
      license_expiration_date:
        input.license_expiration_date ?? existing?.license_expiration_date,
      payment_provider_account_id:
        input.payment_provider_account_id ??
        existing?.payment_provider_account_id,
      payout_method_status: existing?.payout_method_status,
      balance_collected: existing?.balance_collected,
      balance_available: existing?.balance_available,
      user: this.userMapper.toModel(input, existing.user),
    };
    return Object.assign(new Therapist(), existing ?? {}, data);
  }

  public toOutput(input: Therapist): TherapistOutput {
    return Object.assign(new TherapistOutput(), {
      id: input.id,
      user: input.user ? this.userMapper.toOutput(input.user) : undefined,
      user_id: input.userId,
      bio: input.bio,
      years_of_experience: parseFloat(
        input.years_of_experience?.toString() ?? '0',
      ),
      rate_per_hour: parseFloat(input.rate_per_hour?.toString() ?? '0'),
      currency: input.currency
        ? this.currencyMapper.toOutput(input.currency)
        : undefined,
      currency_id: input.currencyId,
      is_psychiatrist: input.is_psychiatrist,
      license_number: input.license_number,
      license_expiration_date: input.license_expiration_date,
      payment_provider_account_id: input.payment_provider_account_id,
      payout_method_status: input.payout_method_status,
      balance_collected: parseFloat(input.balance_collected?.toString() ?? '0'),
      balance_available: parseFloat(input.balance_available?.toString() ?? '0'),
      specializations: input.therapistSpecializations
        ? this.toSpecializationsOutput(input.therapistSpecializations)
        : [],
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }

  public toSpecializationsOutput(
    input: TherapistSpecialization[],
  ): SpecializationOutput[] {
    return input.map((ths) => {
      return {
        id: ths.specializationId,
        name: ths.specialization.name,
        description: ths.specialization.description,
      };
    });
  }
}
