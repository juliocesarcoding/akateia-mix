import { Controller, Get, Param, Sse } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersMonitorService } from './servers-monitor.service';
import {
  distinctUntilChanged,
  from,
  interval,
  map,
  Observable,
  switchMap,
} from 'rxjs';

@Controller('servers')
export class ServersController {
  constructor(
    private readonly serversService: ServersService,
    private readonly monitor: ServersMonitorService,
  ) {}

  @Get()
  list() {
    return this.serversService.list();
  }
  // ✅ TESTE: retorna players via RCON
  @Get(':id/players')
  async players(@Param('id') id: string) {
    const players = await this.serversService.getPlayers(id);

    return {
      ok: true,
      count: players.length,
      players,
    };
  }
  // ✅ “ao vivo”: /servers/:id/live
  @Sse('live')
  live(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => ({ data: this.monitor.getAll() }) as any),
    );
  }
}
