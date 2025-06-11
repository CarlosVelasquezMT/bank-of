import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Función para verificar la conexión de Prisma
export async function testPrismaConnection() {
  try {
    await prisma.$connect()
    console.log("✅ Prisma conectado a Neon exitosamente")
    return true
  } catch (error) {
    console.error("❌ Error conectando Prisma a Neon:", error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}
