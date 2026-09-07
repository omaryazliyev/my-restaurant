import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('My Restorant API')
    .setDescription('Restoran veb-ilovasi uchun to\'liq REST API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 🌙 Swagger-ni zamonaviy Qora rejimga (Dark Theme) o'tkazish
  const theme = new SwaggerTheme();
  const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    customSiteTitle: 'My Restorant API - Dark Documentation',
  };

  SwaggerModule.setup('api/docs', app, document, options);

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  console.log(`🚀 Server ishlamoqda: http://localhost:${PORT}/api`);
  console.log(`📚 Swagger hujjatlari (Qora rejim): http://localhost:${PORT}/api/docs`);
}
bootstrap();

