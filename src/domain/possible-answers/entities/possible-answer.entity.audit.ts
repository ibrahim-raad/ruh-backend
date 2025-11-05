import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { PossibleAnswer } from './possible-answer.entity';

@Entity({ name: 'possible_answers_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class PossibleAnswerAudit extends AuditEntity<PossibleAnswer> {}
