import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Notification } from './notification.entity';

@Entity({ name: 'notifications_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class NotificationAudit extends AuditEntity<Notification> {}
