import { sql } from "@/lib/db";

export async function GET() {
  try {
    console.log("[COURSES API] Request received for all courses endpoint");
    console.log("[COURSES API] Fetching courses from database...")
    const courses = await sql`
      SELECT id, title, description, instructor_name, instructor_image_url,
             price, original_price, discount_percentage, category,
             image_url, video_url, duration_hours, total_lectures,
             total_sections, total_students, language, is_featured, is_active
      FROM courses
      WHERE is_active = true
      ORDER BY is_featured DESC, created_at DESC
    `
    console.log("[COURSES API] Database query executed successfully");
    console.log("[COURSES API] Raw courses result:", JSON.stringify(courses, null, 2));
    console.log("[COURSES API] Number of active courses fetched:", courses.length);

    console.log("[COURSES API] Returning courses response with", courses.length, "courses");
    const response = Response.json(courses, { headers: { "Content-Type": "application/json" } });
    console.log("[COURSES API] Response object created:", response.status);
    return response
  } catch (error) {
    console.error("[COURSES API] Database error occurred:", error);
    console.error("[COURSES API] Error name:", (error as Error).name);
    console.error("[COURSES API] Error message:", (error as Error).message);
    console.error("[COURSES API] Error stack:", (error as Error).stack);

    const response = Response.json({
      message: "Server error. Please try again later.",
      error: String(error),
      errorType: (error as Error).name || 'UnknownError'
    }, {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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

    const result = await sql`
      INSERT INTO courses (
        title, description, instructor_name, instructor_image_url,
        price, original_price, discount_percentage, category,
        image_url, video_url, duration_hours, total_lectures,
        total_sections, language, is_active
      ) VALUES (
        ${title}, ${description || ""}, ${instructor_name}, 
        ${instructor_image_url || "/placeholder.svg?height=300&width=200"},
        ${price}, ${original_price || price}, ${discount_percentage || 0}, 
        ${category || "Development"},
        ${image_url || "/placeholder.svg?height=400&width=600"}, 
        ${video_url || ""}, ${duration_hours || 0}, 
        ${total_lectures || 0}, ${total_sections || 0}, 
        ${language || "English"}, true
      )
      RETURNING id, title, price, category
    `

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    const response = Response.json({ message: "Server error. Please try again later." }, { status: 500 })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}
