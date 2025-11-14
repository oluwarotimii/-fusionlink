import { sql } from "@/lib/db";

export async function GET(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    console.log("[COURSE API] Request received for course endpoint");
    console.log("[COURSE API] Request URL:", request.url);
    console.log("[COURSE API] Request method:", request.method);
    console.log("[COURSE API] Raw params object:", awaitedParams);

    const params = await awaitedParams;
    console.log("[COURSE API] Parsed params:", params);
    console.log("[COURSE API] Fetching course by ID:", params.id);
    console.log("[COURSE API] Type of params.id:", typeof params.id);

    // Validate that the ID is a number
    const courseId = Number.parseInt(params.id, 10);
    console.log("[COURSE API] Attempting to parse ID:", params.id, "to number:", courseId);

    if (isNaN(courseId)) {
      console.log("[COURSE API] Invalid course ID detected:", params.id, "is NaN:", isNaN(courseId));
      return Response.json({ error: "Invalid course ID" }, { status: 400, headers: { "Content-Type": "application/json" } })
    }

    console.log("[COURSE API] Parsed courseId:", courseId, "Type:", typeof courseId);
    console.log("[COURSE API] Executing database query for ID:", courseId);

    const courses = await sql`SELECT * FROM courses WHERE id = ${courseId}`
    console.log("[COURSE API] Database query executed successfully");
    console.log("[COURSE API] Raw database result:", JSON.stringify(courses, null, 2));
    console.log("[COURSE API] Number of results found:", courses.length);

    if (courses.length === 0) {
      console.log("[COURSE API] No course found for ID:", courseId);
      console.log("[COURSE API] Returning 404 response");
      return Response.json({ error: "Course not found" }, { status: 404, headers: { "Content-Type": "application/json" } })
    }

    console.log("[COURSE API] Course found:", JSON.stringify(courses[0], null, 2));
    console.log("[COURSE API] Returning success response with course data");

    const response = Response.json(courses[0], { headers: { "Content-Type": "application/json" } });
    console.log("[COURSE API] Response object created:", response.status);
    return response;
  } catch (error) {
    console.error("[COURSE API] Database error occurred:", error);
    console.error("[COURSE API] Error name:", (error as Error).name);
    console.error("[COURSE API] Error message:", (error as Error).message);
    console.error("[COURSE API] Error stack:", (error as Error).stack);

    return Response.json({
      message: "Server error. Please try again later.",
      error: String(error),
      errorType: (error as Error).name || 'UnknownError'
    }, {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
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
