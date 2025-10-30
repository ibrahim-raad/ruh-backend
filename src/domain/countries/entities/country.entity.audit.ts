import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Country } from './country.entity';

@Entity({ name: 'countries_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class CountryAudit extends AuditEntity<Country> {}
