import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    const params = await awaitedParams;
    console.log("[v0] Fetching reviews for course:", params.id)
    const reviews = await sql`SELECT * FROM reviews WHERE course_id = ${Number.parseInt(params.id)} ORDER BY created_at DESC`
    console.log("[v0] Reviews fetched:", reviews.length)
    return Response.json(reviews)
  } catch (error) {
    console.error("[v0] Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
