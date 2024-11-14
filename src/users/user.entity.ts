import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from 'typeorm';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
