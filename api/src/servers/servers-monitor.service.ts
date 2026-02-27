import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RconService } from '../rcon/rcon.service';

type ServerLive = {
  serverId: string;
  playerCount: number;
  updatedAt: number;
  online: boolean;
};

@Injectable()
export class ServersMonitorService {
  private cache = new Map<string, ServerLive>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly rcon: RconService,
  ) {}

  // Atualiza 1 server (com try/catch)
  async refreshServer(serverId: string): Promise<ServerLive> {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: {
        id: true,
        ip: true,
        port: true,
        rconPassword: true,
        isActive: true,
      },
    });

    if (!server || !server.isActive || !server.rconPassword) {
      const v = {
        serverId,
        playerCount: 0,
        updatedAt: Date.now(),
        online: false,
      };
      this.cache.set(serverId, v);
      return v;
    }

    try {
      const playerCount = await this.rcon.getHumanCount({
        host: server.ip,
        port: server.port,
        password: server.rconPassword,
      });

      const v = { serverId, playerCount, updatedAt: Date.now(), online: true };
      this.cache.set(serverId, v);
      return v;
    } catch {
      const v = {
        serverId,
        playerCount: 0,
        updatedAt: Date.now(),
        online: false,
      };
      this.cache.set(serverId, v);
      return v;
    }
  }

  // Lê cache (se não existir, cria na hora)
  async get(serverId: string): Promise<ServerLive> {
    const cached = this.cache.get(serverId);
    if (cached) return cached;
    return this.refreshServer(serverId);
  }
}
