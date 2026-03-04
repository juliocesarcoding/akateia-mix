import { PrismaClient, ServerMode } from '@prisma/client';

export async function seedServers(prisma: PrismaClient) {
  const servers = [
    {
      name: 'AK Teia Retake #A',
      ip: '177.54.146.23',
      port: 27123,
      password: '940651',
      mode: ServerMode.RETAKE,
      region: 'br-sp',
      isActive: true,
      rconPassword: process.env.DEFAULT_RCON_PASSWORD || 'CHANGE_ME',
    },
    {
      name: 'AK Teia Retake #B 24/7',
      ip: '103.14.27.41',
      port: 27235,
      password: '583029',
      mode: ServerMode.RETAKE,
      region: 'br-sp',
      isActive: true,
      rconPassword: process.env.DEFAULT_RCON_PASSWORD || 'CHANGE_ME',
    },
  ];

  console.log('🌱 Seeding servers...');

  // Opcional: desativa todos antes
  await prisma.server.updateMany({
    data: { isActive: false },
  });

  for (const s of servers) {
    await prisma.server.upsert({
      where: {
        ip_port: {
          ip: s.ip,
          port: s.port,
        },
      },
      update: {
        name: s.name,
        mode: s.mode,
        region: s.region,
        isActive: true,
        rconPassword: s.rconPassword,
      },
      create: s,
    });
  }

  console.log('✅ Seed de servers concluído');
}
