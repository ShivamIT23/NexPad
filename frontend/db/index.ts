import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'

// Singleton factory for Prisma Client
const createPrismaClient = () => {
  return new PrismaClient().$extends(withAccelerate());
};

// Declare the Prisma instance globally to avoid multiple instances during hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

// Create or reuse the Prisma client
const prisma = globalThis.prisma ?? createPrismaClient();

// In development, attach the Prisma client to the global object for reuse
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
