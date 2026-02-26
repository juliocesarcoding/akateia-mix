import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.server.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        ip: true,
        port: true,
        mode: true,
        region: true,
        isActive: true,
      },
    });
  }
}
