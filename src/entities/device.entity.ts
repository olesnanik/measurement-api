import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Measurement } from './measurement.entity';
import { User } from './user.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (u) => u.devices)
  users: User[];

  @ManyToMany(() => Measurement, (m) => m.devices)
  @JoinTable({ name: 'device_measurement' })
  measurements: Measurement[];
}
