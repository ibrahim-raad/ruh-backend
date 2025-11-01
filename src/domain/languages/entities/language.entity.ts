import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('languages')
@Index(['name'])
export class Language extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 2, unique: true })
  code: string;
}
