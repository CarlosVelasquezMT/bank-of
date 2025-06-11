import { neon } from "@neondatabase/serverless"
import 'dotenv/config';

// Cliente SQL para consultas directas
export const sql = neon(process.env.DATABASE_URL!)

// Función para verificar la conexión
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("✅ Conexión a Neon exitosa:", result[0].current_time)
    return true
  } catch (error) {
    console.error("❌ Error conectando a Neon:", error)
    return false
  }
}

// Función para obtener estadísticas de la base de datos
export async function getDatabaseStats() {
  try {
    const [accountCount] = await sql`SELECT COUNT(*) as count FROM accounts`
    const [userCount] = await sql`SELECT COUNT(*) as count FROM users`
    const [movementCount] = await sql`SELECT COUNT(*) as count FROM movements`

    return {
      accounts: Number.parseInt(accountCount.count),
      users: Number.parseInt(userCount.count),
      movements: Number.parseInt(movementCount.count),
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return { accounts: 0, users: 0, movements: 0 }
  }
}
