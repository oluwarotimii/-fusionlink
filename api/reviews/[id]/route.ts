import { sql } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("Fetching reviews for course:", params.id)

    // Validate that the ID is a number
    const courseId = Number.parseInt(params.id, 10);
    if (isNaN(courseId)) {
      console.log("Invalid course ID for reviews:", params.id)
      return Response.json({ error: "Invalid course ID" }, { status: 400 })
    }

    const reviews = await sql`SELECT * FROM reviews WHERE course_id = ${courseId} ORDER BY created_at DESC`
    console.log("Reviews fetched:", reviews.length)
    return Response.json(reviews)
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
