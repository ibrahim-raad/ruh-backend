import { BadRequestException, Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { CreateAdmin } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import { UpdateAdmin } from './dto/update-admin.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { AdminOutput, AdminWithUserOutput } from './dto/admin.output';
import { UserMapper } from '../users/user.mapper';
import { UserRole } from '../users/shared/user-role.enum';

@Injectable()
export class AdminMapper {
  constructor(private readonly userMapper: UserMapper) {}
  public toModel(input: CreateAdmin): Admin;

  public toModel(input: UpdateAdmin, existing: Admin): Admin;

  public toModel(input: CreateAdmin | UpdateAdmin, existing?: Admin): Admin {
    let data = {};

    if (input instanceof UpdateAdmin) {
      if (isDefined(input.admin_version) && isDefined(existing?.version)) {
        if (!isEqual(input.admin_version, existing?.version)) {
          throw new ConflictUpdateError();
        }
      }
      data = {
        admin_role: input.admin_role ?? existing?.admin_role,
        user: this.userMapper.toModel(input, existing!.user),
      };
    } else {
      if (input.role !== UserRole.ADMIN) {
        throw new BadRequestException('User role must be admin');
      }
      data = {
        user: this.userMapper.toModel(input),
        admin_role: input.admin_role,
      };
    }
    return Object.assign(new Admin(), existing ?? {}, data);
  }

  public toOutput(input: Admin): AdminOutput {
    return Object.assign(new AdminOutput(), {
      admin_role: input.admin_role,
      ...this.userMapper.toOutput(input.user),
      id: input.id,
      admin_version: input.version,
    });
  }

  public toWithUserOutput(input: Admin): AdminWithUserOutput {
    return Object.assign(new AdminWithUserOutput(), {
      ...this.toOutput(input),
      id: input.id,
      user: this.userMapper.toOutput(input.user),
      user_id: input.userId,
      admin_version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
