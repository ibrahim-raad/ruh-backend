import { IsEnum, IsNotEmpty } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { AdminRole } from '../shared/admin-role.enum';

@Entity('admins')
@Index(['user'])
export class Admin extends AbstractEntity {
  @IsNotEmpty()
  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((admin: Admin) => admin.user)
  userId: string;

  @IsNotEmpty()
  @IsEnum(AdminRole)
  @Column({ nullable: false, type: 'enum', enum: AdminRole })
  admin_role: AdminRole;
}
