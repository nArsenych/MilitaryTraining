import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  interface Global {
    prisma: PrismaClient | undefined;
  }
}

const globalForPrisma = global as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}