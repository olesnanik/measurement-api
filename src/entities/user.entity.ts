import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Device } from './device.entity';
import { Measurement } from './measurement.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ManyToMany(() => Device, (d) => d.users)
  @JoinTable({ name: 'user_device' })
  devices: Device[];

  @ManyToMany(() => Measurement, (m) => m.users)
  @JoinTable({ name: 'user_measurement' })
  measurements: Measurement[];
}
