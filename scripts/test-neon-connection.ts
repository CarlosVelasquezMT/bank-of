import { testConnection, getDatabaseStats } from "../lib/neon"
import { testPrismaConnection } from "../lib/prisma"

async function main() {
  console.log("🔍 Probando conexión a Neon Database...\n")

  // Probar conexión directa con Neon
  console.log("1. Probando conexión directa con @neondatabase/serverless...")
  const neonConnected = await testConnection()

  if (neonConnected) {
    console.log("✅ Conexión directa exitosa\n")

    // Obtener estadísticas
    console.log("📊 Obteniendo estadísticas de la base de datos...")
    const stats = await getDatabaseStats()
    console.log("Estadísticas:", stats)
  } else {
    console.log("❌ Error en conexión directa\n")
  }

  // Probar conexión con Prisma
  console.log("\n2. Probando conexión con Prisma...")
  const prismaConnected = await testPrismaConnection()

  if (prismaConnected) {
    console.log("✅ Prisma conectado exitosamente")
  } else {
    console.log("❌ Error conectando Prisma")
  }

  console.log("\n🏁 Pruebas de conexión completadas")
}

main().catch(console.error)
