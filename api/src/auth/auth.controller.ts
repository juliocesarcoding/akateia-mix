import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { SteamAuthGuard } from './steam.guard';

@Controller('auth')
export class AuthController {
  @Get('steam')
  @UseGuards(SteamAuthGuard)
  steamLogin() {}

  @Get('steam/return')
  @UseGuards(SteamAuthGuard)
  steamReturn(@Req() req: any, @Res() res: Response) {
    return res.redirect(`${process.env.WEB_URL}/queue`);
  }

  @Get('me')
  me(@Req() req: any) {
    if (!req.user) return { ok: false, user: null };
    return { ok: true, user: req.user };
  }
}
