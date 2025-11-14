import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching reviews for course:", params.id)
    const reviews = await sql("SELECT * FROM reviews WHERE course_id = $1 ORDER BY created_at DESC", [
      Number.parseInt(params.id),
    ])
    console.log("Reviews fetched:", reviews.length)
    return Response.json(reviews)
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
