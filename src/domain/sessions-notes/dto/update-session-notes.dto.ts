import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSessionNotes {
  @IsNotEmpty()
  @IsString()
  readonly content: string;

  // @IsNotEmpty()
  // @IsNumber()
  // readonly version: number;
}
