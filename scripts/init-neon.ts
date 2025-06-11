import { sql } from "../lib/neon"

async function initializeNeonDatabase() {
  console.log("🚀 Inicializando base de datos Neon...")

  try {
    // Verificar conexión
    console.log("1. Verificando conexión...")
    const result = await sql`SELECT NOW() as current_time, version() as version`
    console.log("✅ Conectado a:", result[0].version)
    console.log("⏰ Hora actual:", result[0].current_time)

    // Crear extensiones si es necesario
    console.log("\n2. Verificando extensiones...")
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`
    console.log("✅ Extensiones verificadas")

    // Verificar que las tablas existen
    console.log("\n3. Verificando estructura de tablas...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `

    console.log("📋 Tablas encontradas:")
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`)
    })

    if (tables.length === 0) {
      console.log("⚠️  No se encontraron tablas. Ejecute primero: npm run db:push")
    }

    console.log("\n🎉 Inicialización completada exitosamente!")
  } catch (error) {
    console.error("❌ Error durante la inicialización:", error)
    throw error
  }
}

initializeNeonDatabase().catch(console.error)
