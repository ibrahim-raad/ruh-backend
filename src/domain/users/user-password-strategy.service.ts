import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { DEFAULT_SALT_ROUNDS } from 'src/app.constants';

@Injectable()
export class UserPasswordStrategy {
  private readonly token = `%%`;
  private readonly tokenPattern = new RegExp(
    `^${this.token}(.*)${this.token}$`,
  );

  hash(password: string): string {
    if (this.checkIfHashed(password)) {
      return password;
    }
    return `${this.token}${hashSync(password, DEFAULT_SALT_ROUNDS)}${
      this.token
    }`;
  }

  compare(a: string, b: string): boolean {
    if (this.tokenPattern.test(b)) {
      return compareSync(a, b.replace(this.tokenPattern, '$1'));
    }
    if (this.tokenPattern.test(a)) {
      return compareSync(b, a.replace(this.tokenPattern, '$1'));
    }
    if (!this.tokenPattern.test(a) && !this.tokenPattern.test(b)) {
      return a === b;
    }
    return false;
  }

  checkIfHashed(a: string): boolean {
    return this.tokenPattern.test(a);
  }
}
