import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Measurement } from './measurement.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Measurement, (m) => m.location)
  measurements: Measurement[];
}
