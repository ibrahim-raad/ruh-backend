export class AuditableOutput {
  readonly id: string;

  readonly version?: number;

  readonly created_at?: Date;

  readonly updated_at?: Date;

  readonly deleted_at?: Date;
}
