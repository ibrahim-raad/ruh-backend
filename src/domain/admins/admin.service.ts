import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { Admin } from './entities/admin.entity';
import { SearchAdmin } from './dto/search-admin.dto';
import { AdminAudit } from './entities/admin.entity.audit';
import { UserService } from '../users/user.service';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { FindOutputDto } from '../shared/dto/find-output,dto';

@Injectable()
export class AdminService extends CrudService<Admin, AdminAudit> {
  constructor(
    @InjectRepository(Admin)
    protected readonly repository: Repository<Admin>,
    @InjectRepository(AdminAudit)
    protected readonly auditRepository: Repository<AdminAudit>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {
    super(Admin, repository, auditRepository, {
      user: {
        country: true,
      },
    });
  }

  public async create(input: Admin): Promise<Admin> {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const user = userRepo.create(input.user);
      const savedUser = await userRepo.save(user);
      const adminRepo = manager.getRepository(Admin);
      const admin = adminRepo.create({
        ...input,
        user: savedUser,
      });

      return adminRepo.save(admin);
    });
  }

  public async update(old: Admin, input: Admin): Promise<Admin> {
    await this.userService.update(old.user, input.user);
    return super.update(old, input);
  }

  public async find(criteria: SearchAdmin): Promise<FindOutputDto<Admin>> {
    const userWhere = this.userService.generateWhere(criteria);
    const isNotEmpty = Object.keys(userWhere).length > 0;
    const where = {
      ...(isNotEmpty && {
        user: {
          ...userWhere,
        },
      }),
      ...(isDefined(criteria.admin_roles) && {
        admin_role: In(criteria.admin_roles),
      }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    console.log('where', where);
    console.log('criteria', criteria);

    return this.all(where, criteria, criteria.deleted_at);
  }
}
