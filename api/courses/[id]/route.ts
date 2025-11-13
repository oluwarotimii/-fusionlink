import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] Fetching course:", params.id)
    const courses = await sql("SELECT * FROM courses WHERE id = $1", [Number.parseInt(params.id)])

    if (courses.length === 0) {
      console.log("[v0] Course not found:", params.id)
      return Response.json({ error: "Course not found" }, { status: 404 })
    }

    console.log("[v0] Course fetched successfully")
    return Response.json(courses[0])
  } catch (error) {
    console.error("[v0] Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      category,
      instructor_name,
      instructor_image_url,
      original_price,
      discount_percentage,
      image_url,
      video_url,
      duration_hours,
      total_lectures,
      total_sections,
      total_students,
      language,
    } = body

    const result = await sql(
      `UPDATE courses 
       SET title = $1, description = $2, price = $3, category = $4, 
           instructor_name = $5, instructor_image_url = $6, 
           original_price = $7, discount_percentage = $8,
           image_url = $9, video_url = $10, duration_hours = $11,
           total_lectures = $12, total_sections = $13, total_students = $14,
           language = $15, updated_at = CURRENT_TIMESTAMP
       WHERE id = $16
       RETURNING *`,
      [
        title,
        description,
        price,
        category,
        instructor_name,
        instructor_image_url,
        original_price,
        discount_percentage,
        image_url,
        video_url,
        duration_hours,
        total_lectures,
        total_sections,
        total_students,
        language,
        Number.parseInt(params.id),
      ],
    )

    if (result.length === 0) {
      return Response.json({ error: "Course not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("[v0] Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql("DELETE FROM courses WHERE id = $1", [Number.parseInt(params.id)])
    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
