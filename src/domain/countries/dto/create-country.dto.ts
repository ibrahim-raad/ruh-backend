import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountry {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
