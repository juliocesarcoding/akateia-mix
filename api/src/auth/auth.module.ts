import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SteamStrategy } from './strategies/steam.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { SessionSerializer } from './session.serializar';

import { UsersModule } from '../users/users.module'; // <- você vai criar

@Module({
  imports: [
    PassportModule.register({ session: true }), // mantém
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SteamStrategy,
    SessionSerializer, // mantém
    JwtStrategy, // adiciona
  ],
  exports: [AuthService],
})
export class AuthModule {}
