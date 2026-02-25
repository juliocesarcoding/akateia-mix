import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import 'dotenv/config';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor() {
    super({
      returnURL: process.env.STEAM_RETURN_URL!,
      realm: process.env.STEAM_REALM!,
      apiKey: process.env.STEAM_API_KEY!,
    });
  }

  validate(identifier: string, profile: any, done: Function) {
    const user = {
      steamid: profile.id,
      displayName: profile.displayName,
      avatar: profile.photos?.[2]?.value || profile.photos?.[0]?.value || null,
      // profile._json tem mais dados se você quiser
    };

    done(null, user);
  }
}
