import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { TherapistCertificate } from './therapist-certificate.entity';

@Entity({ name: 'therapists_certificates_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class TherapistCertificateAudit extends AuditEntity<TherapistCertificate> {}
