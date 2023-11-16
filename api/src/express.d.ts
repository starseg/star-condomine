// express.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      operator?: PrismaClient.Operator | null;
    }
  }
}
