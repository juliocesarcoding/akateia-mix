import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'change_me',
      resave: false,
      saveUninitialized: false,
      name: 'akteia.sid',
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(Number(process.env.PORT || 4000));
  console.log(`API on http://localhost:${Number(process.env.PORT || 4000)}`);
}
bootstrap();
