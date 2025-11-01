import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class SpecializationOutput extends AuditableOutput {
  readonly name: string;
  readonly description?: string;
}
