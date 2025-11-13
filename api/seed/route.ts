import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  return Response.json(
    { message: "Seed data is disabled." },
    { status: 200, headers: { "Content-Type": "application/json" } },
  )
}
