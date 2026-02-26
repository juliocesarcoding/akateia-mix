-- CreateEnum
CREATE TYPE "ServerMode" AS ENUM ('MIX', 'RETAKE', 'DM');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "mode" "ServerMode" NOT NULL DEFAULT 'RETAKE',
    "region" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rconPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_ip_port_key" ON "Server"("ip", "port");
