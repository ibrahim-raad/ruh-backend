import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AuditEvent } from './audit-event.enum';

export abstract class AuditEntity<T> {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  seq: number;

  @Column({ nullable: true })
  id?: string;

  @Column({ nullable: true, type: 'uuid' })
  userId?: string;

  @Column({ nullable: false, type: 'enum', enum: AuditEvent })
  event: AuditEvent;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true })
  version?: number;

  @Column({ nullable: true, type: 'jsonb' })
  data?: T;
}
