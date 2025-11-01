import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('countries')
@Index(['name'])
export class Country extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  name: string;
}
