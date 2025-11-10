import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistTransferRequest } from './therapist-transfer-request.entity';

@Entity({ name: 'therapists_transfer_requests_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistTransferRequestAudit extends AuditEntity<TherapistTransferRequest> {}
