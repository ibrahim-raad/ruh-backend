import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class LanguageOutput extends AuditableOutput {
  readonly name: string;
  readonly code: string;
}
