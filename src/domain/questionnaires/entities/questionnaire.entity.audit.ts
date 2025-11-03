import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Questionnaire } from './questionnaire.entity';

@Entity({ name: 'questionnaires_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class QuestionnaireAudit extends AuditEntity<Questionnaire> {}
