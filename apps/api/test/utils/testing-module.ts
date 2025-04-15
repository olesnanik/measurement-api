import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { setupDataSource } from './data-source';
import { App } from 'supertest/types';
import { INestApplication } from '@nestjs/common';
import { AppConfigModule } from '../../src/modules/app-config/app-config.module';
import { ZodValidationPipe } from 'nestjs-zod';

type Options = {
  imports?: Parameters<typeof Test.createTestingModule>[0]['imports'];
};

type CreateTestingModuleResult = {
  app: INestApplication<App>;
  dataSource: DataSource;
  moduleFixture: TestingModule;
};

export async function initTestingModule({
  imports,
}: Options = {}): Promise<CreateTestingModuleResult> {
  const dataSource = await setupDataSource();
  const moduleFixture = await Test.createTestingModule({
    imports: [AppConfigModule, ...(imports ?? [])],
  })
    .overrideProvider(DataSource)
    .useValue(dataSource)
    .compile();

  const app: INestApplication<App> = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ZodValidationPipe());
  await app.init();

  return {
    app,
    dataSource,
    moduleFixture,
  };
}
