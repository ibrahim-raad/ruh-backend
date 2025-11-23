import { IsNotEmpty, IsUrl } from 'class-validator';

export class WebAppConfig {
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  readonly url: string;
}
