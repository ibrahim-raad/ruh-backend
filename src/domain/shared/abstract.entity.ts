import { PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsUUID } from 'class-validator';
import { AuditableEntity } from './auditable.entity';

export abstract class AbstractEntity extends AuditableEntity {
  @IsOptional()
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
