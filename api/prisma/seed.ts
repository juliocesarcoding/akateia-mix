import { PrismaClient, ServerMode } from '@prisma/client';
import { seedServers } from './seeds/servers.seed';

const prisma = new PrismaClient();

async function main() {
  await seedServers(prisma);
  // Ajuste os campos conforme seu model Prisma
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
