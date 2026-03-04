import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findBySteamId(steamId: string) {
    return this.prisma.user.findUnique({ where: { steamId } });
  }

  async createLocalUser(params: {
    email: string;
    password: string;
    nickname?: string;
  }) {
    const exists = await this.findByEmail(params.email);
    if (exists) throw new BadRequestException('E-mail já cadastrado.');

    const passwordHash = await bcrypt.hash(params.password, 10);

    return this.prisma.user.create({
      data: {
        email: params.email,
        passwordHash,
        nickname: params.nickname ?? null,
        profileCompleted: !!params.nickname, // se quiser exigir mais campos, deixe false sempre
      },
    });
  }

  async validateLocalLogin(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user?.passwordHash) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async completeProfile(
    userId: string,
    data: { nickname?: string; phone?: string; email?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        nickname: data.nickname ?? undefined,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        profileCompleted: true,
      },
    });
  }

  /**
   * Steam login:
   * - se existir por steamId -> retorna
   * - se não existir -> cria user parcial (profileCompleted=false)
   */
  async upsertFromSteam(payload: {
    steamId: string;
    displayName?: string;
    avatarUrl?: string;
  }) {
    const existing = await this.findBySteamId(payload.steamId);
    if (existing) {
      // opcional: atualizar displayName/avatar
      return this.prisma.user.update({
        where: { id: existing.id },
        data: {
          displayName: payload.displayName ?? undefined,
          avatarUrl: payload.avatarUrl ?? undefined,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        steamId: payload.steamId,
        displayName: payload.displayName ?? null,
        avatarUrl: payload.avatarUrl ?? null,
        profileCompleted: false,
      },
    });
  }

  /**
   * Link steam no user já logado (local).
   * Protege contra steamId já usado por outro user.
   */
  async linkSteam(userId: string, steamId: string) {
    const used = await this.findBySteamId(steamId);
    if (used && used.id !== userId) {
      throw new BadRequestException(
        'Essa Steam já está vinculada a outra conta.',
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { steamId },
    });
  }
}
