import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { CurrentUser } from './current-user-decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; nickname?: string },
  ) {
    return this.auth.localRegister(body.email, body.password, body.nickname);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.auth.localLogin(body.email, body.password);
  }

  // 1) iniciar steam login
  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  async steam() {
    // redirect feito pelo passport
  }

  /**
   * 2) callback steam:
   * - cria/atualiza user
   * - gera token
   * - redireciona para front com token + flag profileCompleted
   *
   * Bônus: suporta "mode=link" para vincular steam em conta já logada (ver abaixo)
   */
  @Get('steam/callback')
  @UseGuards(AuthGuard('steam'))
  async steamCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('mode') mode?: 'login' | 'link',
    @Query('state') state?: string,
  ) {
    // req.user vem do SteamStrategy.validate()
    const steamPayload = req.user as {
      steamId: string;
      displayName?: string;
      avatarUrl?: string;
    };

    // MODO LOGIN (default)
    if (!mode || mode === 'login') {
      const user = await this.users.upsertFromSteam(steamPayload);
      const token = this.auth.signToken(user.id);

      const front = process.env.WEB_URL!;
      const nextPath = user.profileCompleted ? '/queue' : '/complete-profile';

      // você pode passar token via query, ou setar cookie httpOnly (recomendado)
      return res.redirect(
        `${front}${nextPath}?token=${encodeURIComponent(token)}`,
      );
    }

    // MODO LINK (vincular steam em user já logado)
    // Aqui você precisa identificar o user logado do "link flow".
    // O jeito mais simples: você inicia o link com um "state" assinado contendo o userId.
    // Vou deixar pronto o endpoint para gerar esse state.
    return res.status(400).send('Link mode requires state');
  }

  /**
   * Gera URL de link steam para usuário logado
   * (você inicia o fluxo em /auth/steam?mode=link&state=...)
   */
  @UseGuards(JwtAuthGuard)
  @Get('steam/link-url')
  async steamLinkUrl(@CurrentUser() user: { id: string }) {
    const state = Buffer.from(JSON.stringify({ uid: user.id })).toString(
      'base64url',
    );
    const url = `${process.env.API_URL}/auth/steam?mode=link&state=${state}`;
    return { ok: true, url };
  }

  /**
   * Ajuste do endpoint /auth/steam para aceitar mode/link state
   * (o passport-steam lê query normalmente; se não, você só redireciona manualmente)
   */
  @Get('steam-link')
  @UseGuards(AuthGuard('steam'))
  async steamLink() {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    const u = await this.users.findById(user.id);
    return { ok: true, user: u };
  }
}
