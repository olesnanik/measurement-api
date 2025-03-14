import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Measurement } from './measurement.entity';

@Entity()
export class MeasurementType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  unitName: string;

  @OneToMany(() => Measurement, (m) => m.measurementType)
  measurements: Measurement[];
}
