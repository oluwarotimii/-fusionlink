import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export async function testConnection() {
  try {
    console.log("[v0] Testing database connection...")
    const result = await sql("SELECT 1 as connection_test")
    console.log("[v0] Database connection successful:", result)
    return true
  } catch (error) {
    console.error("[v0] Database connection failed:", error)
    return false
  }
}
