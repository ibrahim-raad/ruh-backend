import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class CurrencyOutput extends AuditableOutput {
  readonly name: string;
  readonly code: string;
  readonly symbol?: string;
}
