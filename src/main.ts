import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { load } from 'ts-yaml-loader';
import { validateFor } from './lib/class-validator-extensions/validate-or-throw';
import { useGlobalDefaults } from './app.globals';
import * as path from 'path';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(config: AppConfig) {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(config),
    {
      cors: true,
      rawBody: true,
      bufferLogs: true,
    },
  );

  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  dotenv.config();

  const logger = app.get(Logger);
  app.useLogger(logger);

  // Setting globals
  useGlobalDefaults(app);

  app.use(cookieParser());

  // Setting up swagger
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(config.swagger.title)
      .setDescription(config.swagger.description)
      .setVersion(config.version)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build(),
  );
  SwaggerModule.setup(config.swagger.path, app, document);

  await app.listen(3000);

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:');
    logger.error(reason);
  });
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:');
    logger.error(error);
  });

  return logger;
}
dotenv.config({ path: path.join(__dirname, '../.env') });

const config = load<AppConfig>({ validate: validateFor(AppConfig) });

bootstrap(config)
  .then((it) => it.log(`Service initialized on port ${config.port}`))
  .catch((error) => {
    console.error('Error initializing service:');
    console.error(error);
  });
