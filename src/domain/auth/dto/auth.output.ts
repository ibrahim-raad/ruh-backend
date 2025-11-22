import { UserOutput } from 'src/domain/users/dto/user.output';

export class AuthOutput {
  readonly user: UserOutput;

  readonly tokens: { access_token?: string; refresh_token?: string };
}
