import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionChat {
  @IsNotEmpty()
  @IsString()
  readonly message: string;
}
