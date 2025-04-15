import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserModule } from '../user.module';
import { User, UserRole } from '../../shared/entities/user.entity';
import { initTestingModule } from '../../../../test/utils/testing-module';
import { AppConfigService } from '../../app-config/app-config.service';
import { UserCreateDto } from '../dto/user-create-dto';
import { Optional } from 'pg-mem/types/utils';

describe('User controller', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  let userRepository: Repository<User>;
  let appConfigService: AppConfigService;

  beforeEach(async () => {
    const testingModule = await initTestingModule({ imports: [UserModule] });
    app = testingModule.app;
    moduleFixture = testingModule.moduleFixture;

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    appConfigService = moduleFixture.get(AppConfigService);
  });

  describe('/user (POST)', () => {
    function postUser(user: Optional<UserCreateDto>) {
      return request(app.getHttpServer())
        .post('/user')
        .auth(
          appConfigService.get('API_USER_ADMIN_BASIC_USERNAME') ?? '',
          appConfigService.get('API_USER_ADMIN_BASIC_PASSWORD') ?? '',
        )
        .send(user);
    }

    it('should return 401 if not authenticated', () =>
      request(app.getHttpServer()).post('/user').expect(401));

    it('should return 400 for missing name', () =>
      postUser({ login: 'john-doe', password: 'XXXXXXXXXXXX' }).expect(400));

    it('should return 400 for missing password', () =>
      postUser({ login: 'john-doe', name: 'Name' }).expect(400));

    it('should return 400 for weak password', () =>
      postUser({ login: 'john-doe', name: 'Name', password: 'p' }).expect(400));

    it('should return 400 for missing login', () =>
      postUser({ name: 'john-doe', password: 'XXXXXXXXXXXX' }).expect(400));

    it('should create a user', async () => {
      const user: UserCreateDto = {
        name: 'John Doe',
        login: 'john-doe',
        password: 'John-Doe-123',
      };
      await postUser(user).expect(201).expect('');

      expect(
        await userRepository.existsBy({ name: user.name, login: user.login }),
      ).toEqual(true);
    });

    it('should hash a password', async () => {
      const user: UserCreateDto = {
        name: 'John Doe',
        login: 'john-doe',
        password: 'John-Doe-123',
      };
      await postUser(user).expect(201).expect('');

      const savedUser = await userRepository.findOneOrFail({
        where: { name: user.name, login: user.login },
        select: ['password'],
      });

      expect(savedUser.password).toBeTruthy();
      expect(savedUser.password).not.toEqual(user.password);
    });

    it('should use "user" as a default role', async () => {
      const user: UserCreateDto = {
        name: 'John Doe',
        login: 'john-doe',
        password: 'John-Doe-123',
      };
      await postUser(user);

      expect(
        await userRepository.existsBy({
          name: user.name,
          login: user.login,
          role: UserRole.USER,
        }),
      ).toEqual(true);
    });
  });
});
