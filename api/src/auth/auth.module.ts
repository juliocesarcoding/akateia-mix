import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { SteamStrategy } from './steam.strategy';
import { SessionSerializer } from './session.serializar';

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [SteamStrategy, SessionSerializer],
})
export class AuthModule {}
