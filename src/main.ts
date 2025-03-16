import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ZodValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Measurement API')
    .setDescription('Measurement API documentation')
    .setVersion('1.0')
    .addBearerAuth(undefined, 'user-bearer-auth')
    .addBasicAuth(
      { type: 'http', scheme: 'basic' },
      'basic-auth', // Security name (must match @ApiBasicAuth decorator)
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
