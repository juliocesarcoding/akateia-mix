import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RconService } from 'src/rcon/rcon.service';

@Injectable()
export class ServersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rcon: RconService,
  ) {}

  list() {
    return this.prisma.server.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        ip: true,
        port: true,
        password: true,
        mode: true,
        region: true,
        isActive: true,
      },
    });
  }

  async getPlayers(serverId: string) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ip: true, port: true, rconPassword: true },
    });

    if (!server) throw new NotFoundException('Server não encontrado');
    if (!server.rconPassword) return [];

    return this.rcon.getPlayers({
      host: server.ip,
      port: server.port,
      password: server.rconPassword,
    });
  }
  async getHumanCount(serverId: string) {
    const server = await this.prisma.server.findUnique({
      where: { id: serverId },
      select: { ip: true, port: true, rconPassword: true },
    });

    if (!server) throw new NotFoundException('Server não encontrado');
    if (!server.rconPassword) return 0;

    return this.rcon.getHumanCount({
      host: server.ip,
      port: server.port,
      password: server.rconPassword,
    });
  }
}
