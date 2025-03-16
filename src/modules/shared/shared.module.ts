import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Device } from './entities/device.entity';
import { Measurement } from './entities/measurement.entity';
import { MeasurementType } from './entities/measurement-type.entity';
import { MeasurementValue } from './entities/measurement-value.entity';
import { Location } from './entities/location.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Device,
      Location,
      Measurement,
      MeasurementType,
      MeasurementValue,
    ]),
  ],
})
export class SharedModule {}
