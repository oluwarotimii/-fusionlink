import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    console.log("[v0] Fetching courses from database...")
    const courses = await sql(
      "SELECT id, title, description, instructor_name, instructor_image_url, price, original_price, discount_percentage, category, image_url, video_url, duration_hours, total_lectures, total_sections, total_students, language, is_featured, is_active FROM courses WHERE is_active = true ORDER BY is_featured DESC, created_at DESC",
    )
    console.log("[v0] Courses fetched successfully:", courses.length)

    const coursesWithNumericPrice = courses.map((course) => ({
      ...course,
      price: parseFloat(course.price as string),
    }))

    const response = Response.json(coursesWithNumericPrice)
    response.headers.set("Content-Type", "application/json")
    return response
  } catch (error) {
    console.error("[v0] Database error:", error)
    const response = Response.json({ message: "Server error. Please try again later." }, { status: 500 })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      instructor_name,
      instructor_image_url,
      price,
      original_price,
      discount_percentage,
      category,
      image_url,
      video_url,
      duration_hours,
      total_lectures,
      total_sections,
      language,
    } = body

    if (!title || !instructor_name || price === undefined) {
      return Response.json({ error: "Missing required fields: title, instructor_name, price" }, { status: 400 })
    }

    const result = await sql(
      `INSERT INTO courses (
        title, description, instructor_name, instructor_image_url,
        price, original_price, discount_percentage, category,
        image_url, video_url, duration_hours, total_lectures,
        total_sections, language, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true)
      RETURNING id, title, price, category`,
      [
        title,
        description || "",
        instructor_name,
        instructor_image_url || "/placeholder.svg?height=300&width=200",
        price,
        original_price || price,
        discount_percentage || 0,
        category || "Development",
        image_url || "/placeholder.svg?height=400&width=600",
        video_url || "",
        duration_hours || 0,
        total_lectures || 0,
        total_sections || 0,
        language || "English",
      ],
    )

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Database error:", error)
    const response = Response.json({ message: "Server error. Please try again later." }, { status: 500 })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}
