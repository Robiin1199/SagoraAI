import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    });
  } catch (error) {
    console.warn("Prisma client initialization failed. Falling back to a no-op client.", error);
    return new Proxy(
      {},
      {
        get() {
          throw new Error(
            "Prisma client is unavailable. Ensure `prisma generate` has been executed before running the application."
          );
        }
      }
    ) as PrismaClient;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
