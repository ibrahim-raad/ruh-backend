import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { Question } from './question.entity';

@Entity({ name: 'questions_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class QuestionAudit extends AuditEntity<Question> {}
