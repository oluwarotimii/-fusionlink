import { sql } from "@/lib/db";

export async function GET(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    const params = await awaitedParams;
    console.log(" Fetching course by ID:", params.id)

    // Validate that the ID is a number
    const courseId = Number.parseInt(params.id, 10);
    if (isNaN(courseId)) {
      console.log(" Invalid course ID:", params.id)
      return Response.json({ error: "Invalid course ID" }, { status: 400 })
    }

    console.log("Parsed courseId:", courseId)
    const courses = await sql`SELECT * FROM courses WHERE id = ${courseId}`
    console.log(" Database query result:", courses)

    if (courses.length === 0) {
      console.log("Course not found for ID:", courseId)
      return Response.json({ error: "Course not found" }, { status: 404 })
    }

    console.log(" Course fetched successfully:", courses[0])
    return Response.json(courses[0])
  } catch (error) {
    console.error(" Database error:", error)
    return Response.json({ message: "Server error. Please try again later.", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    const params = await awaitedParams;
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

    const result = await sql`UPDATE courses
       SET title = ${title}, description = ${description}, price = ${price}, category = ${category},
           instructor_name = ${instructor_name}, instructor_image_url = ${instructor_image_url},
           original_price = ${original_price}, discount_percentage = ${discount_percentage},
           image_url = ${image_url}, video_url = ${video_url}, duration_hours = ${duration_hours},
           total_lectures = ${total_lectures}, total_sections = ${total_sections}, total_students = ${total_students},
           language = ${language}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ${Number.parseInt(params.id)}
       RETURNING *`
    if (result.length === 0) {
      return Response.json({ error: "Course not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error(" Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    const params = await awaitedParams;
    await sql`DELETE FROM courses WHERE id = ${Number.parseInt(params.id)}`
    return Response.json({ success: true })
  } catch (error) {
    console.error(" Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
