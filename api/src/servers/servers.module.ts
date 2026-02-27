import { Module } from '@nestjs/common';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { RconModule } from 'src/rcon/rcon.module';
import { ServersMonitorService } from './servers-monitor.service';

@Module({
  imports: [RconModule],
  controllers: [ServersController],
  providers: [ServersService, ServersMonitorService],
})
export class ServersModule {}
