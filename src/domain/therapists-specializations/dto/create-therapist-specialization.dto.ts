import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTherapistSpecialization {
  @IsNotEmpty()
  @IsUUID()
  readonly specialization_id: string;
}
