// apps/api/src/servers/servers-monitor.service.ts

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RconService } from '../rcon/rcon.service';

export type ServerLive = {
  serverId: string;
  playerCount: number;
  updatedAt: number; // epoch ms
  online: boolean; // true = respondeu RCON; false = erro/offline/sem rconPassword
};

type MonitorConfig = {
  intervalMs: number; // frequência de atualização
  maxConcurrent: number; // limite de RCON em paralelo
  requestTimeoutMs: number; // timeout por comando
};

@Injectable()
export class ServersMonitorService implements OnModuleInit, OnModuleDestroy {
  private cache = new Map<string, ServerLive>();

  private timer: NodeJS.Timeout | null = null;
  private started = false;

  private cfg: MonitorConfig = {
    intervalMs: 5000,
    maxConcurrent: 3,
    requestTimeoutMs: 4500,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly rcon: RconService,
  ) {}

  onModuleInit() {
    this.start();
  }

  onModuleDestroy() {
    this.stop();
  }

  /** Inicia o loop único de monitoramento (1x por API, não por usuário) */
  start(overrides?: Partial<MonitorConfig>) {
    if (this.started) return;
    this.started = true;

    if (overrides) this.cfg = { ...this.cfg, ...overrides };

    // roda já no start
    void this.refreshAll();

    // loop
    this.timer = setInterval(() => {
      void this.refreshAll();
    }, this.cfg.intervalMs);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.started = false;
  }

  /** Retorna o snapshot atual do cache (para SSE global / front) */
  getAll(): ServerLive[] {
    return Array.from(this.cache.values());
  }

  /** Retorna o status live de um server (cache). Se não existir, devolve default. */
  get(serverId: string): ServerLive {
    return (
      this.cache.get(serverId) ?? {
        serverId,
        playerCount: 0,
        updatedAt: 0,
        online: false,
      }
    );
  }

  /** Força refresh de 1 server e atualiza cache (útil pra endpoint específico) */
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
      const v: ServerLive = {
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

      const v: ServerLive = {
        serverId,
        playerCount,
        updatedAt: Date.now(),
        online: true,
      };

      this.cache.set(serverId, v);
      return v;
    } catch {
      const v: ServerLive = {
        serverId,
        playerCount: 0,
        updatedAt: Date.now(),
        online: false,
      };
      this.cache.set(serverId, v);
      return v;
    }
  }

  /**
   * Atualiza todos os servers ativos 1x por ciclo, com limite de concorrência,
   * evitando spammar RCON.
   */
  private async refreshAll(): Promise<void> {
    const servers = await this.prisma.server.findMany({
      where: { isActive: true },
      select: { id: true, ip: true, port: true, rconPassword: true },
      orderBy: { name: 'asc' },
    });

    // Se algum server foi desativado/removido, ainda pode ficar no cache.
    // (Opcional) limpar cache de servers que não vieram:
    const currentIds = new Set(servers.map((s) => s.id));
    for (const id of this.cache.keys()) {
      if (!currentIds.has(id)) this.cache.delete(id);
    }

    // monta tarefas
    const tasks = servers.map((s) => async () => {
      if (!s.rconPassword) {
        this.cache.set(s.id, {
          serverId: s.id,
          playerCount: 0,
          updatedAt: Date.now(),
          online: false,
        });
        return;
      }

      try {
        const playerCount = await this.rcon.getHumanCount({
          host: s.ip,
          port: s.port,
          password: s.rconPassword,
        });

        this.cache.set(s.id, {
          serverId: s.id,
          playerCount,
          updatedAt: Date.now(),
          online: true,
        });
      } catch {
        this.cache.set(s.id, {
          serverId: s.id,
          playerCount: 0,
          updatedAt: Date.now(),
          online: false,
        });
      }
    });

    await this.runWithConcurrencyLimit(tasks, this.cfg.maxConcurrent);
  }

  /** Executor simples com limite de concorrência */
  private async runWithConcurrencyLimit(
    tasks: Array<() => Promise<void>>,
    maxConcurrent: number,
  ): Promise<void> {
    const concurrency = Math.max(1, maxConcurrent);

    let index = 0;
    const workers = Array.from(
      { length: Math.min(concurrency, tasks.length) },
      async () => {
        while (index < tasks.length) {
          const myIndex = index++;
          await tasks[myIndex]();
        }
      },
    );

    await Promise.all(workers);
  }
}
