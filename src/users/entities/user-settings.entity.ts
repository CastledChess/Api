import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomBaseEntity } from '../../common/entities/custom-base.entity';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings extends CustomBaseEntity {
  @Column({ default: 'fr' })
  language: string;

  @Column({ default: 'light' })
  theme: string;

  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, name: 'dark_mode' })
  darkMode: boolean;
}
