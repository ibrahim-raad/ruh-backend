import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AdminRole } from '../shared/admin-role.enum';
import { CreateUser } from 'src/domain/users/dto/create-user.dto';

export class CreateAdmin extends CreateUser {
  @IsNotEmpty()
  @IsEnum(AdminRole)
  readonly admin_role: AdminRole;
}
