import { Injectable } from '@nestjs/common';
import { UserMapper } from '../users/user.mapper';

@Injectable()
export class AuthMapper {
  constructor(private readonly userMapper: UserMapper) {}
}
