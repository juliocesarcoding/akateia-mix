import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: `${process.env.STEAM_REALM}/auth/steam/callback`,
      realm: process.env.STEAM_REALM!,
      apiKey: process.env.STEAM_API_KEY!,
    });
  }

  validate(identifier: string, profile: any, done: Function) {
    const steamId = profile?.id;
    const displayName = profile?.displayName;
    const avatarUrl =
      profile?.photos?.[2]?.value ||
      profile?.photos?.[1]?.value ||
      profile?.photos?.[0]?.value;

    done(null, { steamId, displayName, avatarUrl });
  }
}
