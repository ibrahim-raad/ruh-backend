import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class CountryOutput extends AuditableOutput {
  readonly name: string;
}
