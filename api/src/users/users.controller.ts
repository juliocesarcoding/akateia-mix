import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CurrentUser } from '../auth/current-user-decorator'; // vou te mostrar abaixo

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string }) {
    return this.users.findById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-profile')
  async complete(
    @CurrentUser() user: { id: string },
    @Body() dto: CompleteProfileDto,
  ) {
    const updated = await this.users.completeProfile(user.id, dto);
    return { ok: true, user: updated };
  }
}
