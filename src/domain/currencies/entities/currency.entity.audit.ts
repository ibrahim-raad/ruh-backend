import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Currency } from './currency.entity';

@Entity({ name: 'currencies_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class CurrencyAudit extends AuditEntity<Currency> {}
