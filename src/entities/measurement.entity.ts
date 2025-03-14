import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { MeasurementValue } from './measurement-value.entity';
import { MeasurementType } from './measurement-type.entity';
import { Location } from './location.entity';
import { Device } from './device.entity';
import { User } from './user.entity';

@Entity()
export class Measurement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => MeasurementValue, (v) => v.measurement)
  measurementValues: MeasurementValue[];

  @ManyToOne(() => MeasurementType, (mt) => mt.measurements)
  measurementType: MeasurementType;

  @ManyToOne(() => Location, (l) => l.measurements)
  location: Location;

  @ManyToMany(() => Device, (d) => d.measurements)
  devices: Device[];

  @ManyToMany(() => User, (u) => u.measurements)
  users: User[];
}
