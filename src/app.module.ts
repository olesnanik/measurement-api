import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './entities/user.entity';
import { MeasurementType } from './entities/measurement-type.entity';
import { Location } from './entities/location.entity';
import { Device } from './entities/device.entity';
import { MeasurementValue } from './entities/measurement-value.entity';
import { Measurement } from './entities/measurement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'my_user',
      password: 'my_password',
      database: 'my_database',
      entities: [
        User,
        Device,
        Location,
        Measurement,
        MeasurementType,
        MeasurementValue,
      ],
      synchronize: true, // Auto-create tables (only for development)
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
