import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Measurement } from './measurement.entity';

@Entity()
export class MeasurementValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateAdd: Date;

  @Column('float')
  value: number;

  @ManyToOne(() => Measurement, (m) => m.measurementValues)
  measurement: Measurement;
}
