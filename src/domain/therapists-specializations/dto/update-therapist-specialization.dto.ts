import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class UpdateTherapistSpecialization {
  @IsNotEmpty()
  @IsUUID()
  readonly specialization_id: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
