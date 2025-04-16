import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Optional } from 'pg-mem/types/utils';
import { User, UserRole } from '../shared/entities/user.entity';
import { AppConfigService } from '../app-config/app-config.service';
import { initTestingModule } from '../../../test/utils/testing-module';
import { UserModule } from './user.module';
import { UserCreateDto } from './dto/user-create-dto';

describe('User module', () => {
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

  function postUser(user: Optional<UserCreateDto>) {
    return request(app.getHttpServer())
      .post('/user')
      .auth(
        appConfigService.get('API_USER_ADMIN_BASIC_USERNAME') ?? '',
        appConfigService.get('API_USER_ADMIN_BASIC_PASSWORD') ?? '',
      )
      .send(user);
  }

  describe('User', () => {
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

  describe('Auth', () => {
    let user: UserCreateDto;

    beforeEach(async () => {
      user = {
        name: 'John Doe',
        login: 'john-doe',
        password: 'John-Doe-123',
      };
      await postUser(user);
    });

    it('should login a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
          password: user.password,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 400 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
          password: 'wrong-password',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing login', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          password: user.password,
        });

      expect(response.status).toBe(400);
    });

    it('should refresh token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
          password: user.password,
        });

      const { refreshToken } = loginResponse.body as {
        accessToken: string;
        refreshToken: string;
      };

      const response = await request(app.getHttpServer())
        .post('/user/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });

    it('should return 401 for logout route without a Bearer token', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth/logout')
        .send();

      expect(response.status).toEqual(401);
    });

    it('should logout a user', async () => {
      await postUser(user);
      const loginResponse = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
          password: user.password,
        });

      const { accessToken } = loginResponse.body as {
        accessToken: string;
        refreshToken: string;
      };

      const response = await request(app.getHttpServer())
        .post('/user/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .send();

      expect(response.status).toBe(204);
    });

    it('should return 401 for the second logout attempt with tha same accessToken', async () => {
      await postUser(user);
      const loginResponse = await request(app.getHttpServer())
        .post('/user/auth/login')
        .send({
          login: user.login,
          password: user.password,
        });

      const { accessToken } = loginResponse.body as {
        accessToken: string;
        refreshToken: string;
      };

      await request(app.getHttpServer())
        .post('/user/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .send();

      const response = await request(app.getHttpServer())
        .post('/user/auth/logout')
        .auth(accessToken, { type: 'bearer' })
        .send();

      expect(response.status).toEqual(401);
    });
  });
});
