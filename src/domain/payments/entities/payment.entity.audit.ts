import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'payments_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class PaymentAudit extends AuditEntity<Payment> {}
