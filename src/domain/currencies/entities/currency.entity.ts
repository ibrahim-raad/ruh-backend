import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('currencies')
@Index(['name'])
@Index(['code'])
@Index(['symbol'])
export class Currency extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 3, unique: true })
  code: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true, length: 1 })
  symbol?: string;
}
