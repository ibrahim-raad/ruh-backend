import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('specializations')
@Index(['name'])
export class Specialization extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  name: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 255 })
  description?: string;
}
