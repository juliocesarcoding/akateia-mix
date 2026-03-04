import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  signToken(userId: string) {
    return this.jwt.sign({ sub: userId });
  }

  async localLogin(email: string, password: string) {
    const user = await this.users.validateLocalLogin(email, password);
    if (!user) return { ok: false as const, error: 'Credenciais inválidas' };

    const token = this.signToken(user.id);
    return { ok: true as const, token, user };
  }

  async localRegister(email: string, password: string, nickname?: string) {
    const user = await this.users.createLocalUser({
      email,
      password,
      nickname,
    });
    const token = this.signToken(user.id);
    return { ok: true as const, token, user };
  }
}
