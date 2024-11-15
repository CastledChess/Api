import { Entity, Column, Index, OneToMany } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { CustomBaseEntity } from '../common/entities/custom-base.entity';
import { Analysis } from '../analysis/entities/analysis.entity';

@Entity('users')
export class User extends CustomBaseEntity {
  @Column({ unique: true })
  @IsEmail()
  @Index()
  email: string;

  @Column()
  @IsString()
  @MinLength(3)
  username: string;

  @Column()
  @Exclude()
  @MinLength(8)
  password: string;

  @OneToMany(() => Analysis, (analysis) => analysis.user)
  analyses: Analysis[];
}
