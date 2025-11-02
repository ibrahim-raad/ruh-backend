import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Language } from 'src/domain/languages/entities/language.entity';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { IsBooleanish } from 'src/domain/shared/decorators';
import { User } from 'src/domain/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  RelationId,
} from 'typeorm';

@Entity('users_spoken_languages')
@Index(['user'])
@Index(['user', 'language'], { unique: true })
export class UserSpokenLanguage extends AbstractEntity {
  @IsNotEmpty()
  @ManyToOne(() => User, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId(
    (userSpokenLanguage: UserSpokenLanguage) => userSpokenLanguage.user,
  )
  userId: string;

  @IsNotEmpty()
  @ManyToOne(() => Language, {
    nullable: false,
    cascade: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @RelationId(
    (userSpokenLanguage: UserSpokenLanguage) => userSpokenLanguage.language,
  )
  languageId: string;

  @IsOptional()
  @IsBooleanish()
  @Column({ nullable: false, default: false, type: 'boolean' })
  is_primary: boolean = false;
}
