import { Injectable } from '@nestjs/common';
import { Rcon } from 'rcon-client';
import { RconError } from './rcon.errors';
import type { RconExecOptions, RconTarget } from './rcon.types';
import {
  parseHumanCountFromStatus,
  parsePlayersFromStatus,
} from './parsers/status.parser';

type ConnKey = string;

@Injectable()
export class RconService {
  // cache simples de conexão (por server)
  private conns = new Map<ConnKey, { client: Rcon; lastUsedAt: number }>();

  private keyOf(t: RconTarget) {
    return `${t.host}:${t.port}`;
  }

  private async getClient(t: RconTarget, timeoutMs: number): Promise<Rcon> {
    const key = this.keyOf(t);
    const existing = this.conns.get(key);

    // Reuso simples (se existir)
    if (existing) {
      existing.lastUsedAt = Date.now();
      return existing.client;
    }

    // Nova conexão
    try {
      const client = await Rcon.connect({
        host: t.host,
        port: t.port,
        password: t.password,
        timeout: timeoutMs, // timeout de conexão
      });

      this.conns.set(key, { client, lastUsedAt: Date.now() });
      return client;
    } catch (e: any) {
      throw new RconError(
        `Falha ao conectar via RCON em ${key}: ${e?.message ?? e}`,
      );
    }
  }

  // Opcional: limpeza de conexões antigas (chame num cron ou interval)
  cleanupIdleConnections(maxIdleMs = 60_000) {
    const now = Date.now();
    for (const [key, v] of this.conns.entries()) {
      if (now - v.lastUsedAt > maxIdleMs) {
        try {
          v.client.end();
        } catch {}
        this.conns.delete(key);
      }
    }
  }

  async exec(target: RconTarget, command: string, opts: RconExecOptions = {}) {
    const timeoutMs = opts.timeoutMs ?? 4000;
    const retries = opts.retries ?? 1;
    const retryDelayMs = opts.retryDelayMs ?? 250;

    let lastErr: any;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const client = await this.getClient(target, timeoutMs);

        // timeout por comando (garantia)
        const result = await Promise.race([
          client.send(command),
          new Promise<string>((_, rej) =>
            setTimeout(
              () => rej(new RconError(`Timeout no comando RCON: ${command}`)),
              timeoutMs,
            ),
          ),
        ]);

        return String(result ?? '');
      } catch (e: any) {
        lastErr = e;

        // se caiu a conexão, derruba cache e tenta de novo
        const key = this.keyOf(target);
        const cached = this.conns.get(key);
        if (cached) {
          try {
            cached.client.end();
          } catch {}
          this.conns.delete(key);
        }

        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, retryDelayMs));
          continue;
        }
      }
    }

    throw new RconError(lastErr?.message ?? 'Erro desconhecido no RCON');
  }

  // Helpers prontos pro AKTÉIA MIX
  async getStatus(target: RconTarget) {
    return this.exec(target, 'status', { timeoutMs: 4500, retries: 1 });
  }

  async getHumanCount(target: RconTarget) {
    const status = await this.getStatus(target);
    return parseHumanCountFromStatus(status);
  }

  async getPlayers(target: RconTarget) {
    const status = await this.getStatus(target);
    return parsePlayersFromStatus(status);
  }

  async changeMap(target: RconTarget, map: string) {
    // CS: changelevel de_mirage
    return this.exec(target, `changelevel ${map}`, {
      timeoutMs: 5000,
      retries: 1,
    });
  }

  async say(target: RconTarget, msg: string) {
    // CS: say "texto"
    const safe = msg.replace(/"/g, '\\"');
    return this.exec(target, `say "${safe}"`, { timeoutMs: 3500, retries: 0 });
  }
}
