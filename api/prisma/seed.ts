import { PrismaClient, ServerMode } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ajuste os campos conforme seu model Prisma
  const servers = [
    {
      name: 'AK Teia Server 24/7',
      ip: '177.54.146.23',
      port: 27123,
      password: '940651',
      mode: ServerMode.RETAKE,
      region: 'br-sp',
      isActive: true,
      rconPassword: 'CHANGE_ME',
    },
  ];

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
        isActive: s.isActive,
        rconPassword: s.rconPassword,
      },
      create: s,
    });
  }

  console.log('✅ Seed de servers concluído');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
