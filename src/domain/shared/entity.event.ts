import { User } from '../users/entities/user.entity';
import { AuditableEntity } from './auditable.entity';

export class EntityEvent<Model extends AuditableEntity> {
  constructor(
    readonly data: Model,
    readonly user?: User,
  ) {}
}
