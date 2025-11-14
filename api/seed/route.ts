import { sql } from "@/lib/db";

export async function GET() {
  return Response.json(
    { message: "Seed data is disabled." },
    { status: 200, headers: { "Content-Type": "application/json" } },
  )
}
