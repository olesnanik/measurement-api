import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../shared/entities/user.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  accessToken: string;

  @Column({ unique: true })
  refreshToken: string;

  @ManyToOne(() => User, {
    nullable: true,
  })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
