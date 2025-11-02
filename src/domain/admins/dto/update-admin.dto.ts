import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { AdminRole } from '../shared/admin-role.enum';
import { UpdateUser } from 'src/domain/users/dto/update-user.dto';

export class UpdateAdmin extends UpdateUser {
  @IsOptional()
  @IsEnum(AdminRole)
  readonly admin_role?: AdminRole;

  @IsNotEmpty()
  @IsNumber()
  readonly admin_version: number;
}
