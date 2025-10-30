// import { User } from '../users/entities/user.entity';
import { AuditableEntity } from './auditable.entity';

type User = any; // TODO: Add user type

export class EntityEvent<Model extends AuditableEntity> {
  constructor(
    readonly data: Model,
    readonly user?: User,
  ) {}
}
