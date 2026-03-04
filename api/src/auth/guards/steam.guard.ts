import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SteamAuthGuard extends AuthGuard('steam') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;

    // 🔥 isso é o que realmente grava o user na session (req.logIn)
    const req = context.switchToHttp().getRequest();
    await super.logIn(req);

    return result;
  }
}
