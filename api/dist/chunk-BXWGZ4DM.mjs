// src/db.ts
import { PrismaClient } from "@prisma/client";
var prismaClientSingleton = () => {
  return new PrismaClient();
};
var prisma = globalThis.prisma ?? prismaClientSingleton();
var db_default = prisma;
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export {
  db_default
};
