import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { MeasurementModule } from './modules/measurement/measurement.module';

@Module({
  imports: [DatabaseModule, SharedModule, UserModule, MeasurementModule],
})
export class AppModule {}
