import { sql } from "@/lib/db";

export async function GET(request: Request, { params: awaitedParams }: { params: Promise<{ id: string }> }) {
  try {
    console.log("[REVIEWS API] Request received for reviews endpoint");
    console.log("[REVIEWS API] Request URL:", request.url);
    console.log("[REVIEWS API] Request method:", request.method);
    console.log("[REVIEWS API] Raw params object:", awaitedParams);

    const params = await awaitedParams;
    console.log("[REVIEWS API] Parsed params:", params);
    console.log("[REVIEWS API] Fetching reviews for course ID:", params.id);
    console.log("[REVIEWS API] Type of params.id:", typeof params.id);

    // Validate that the ID is a number
    const courseId = Number.parseInt(params.id, 10);
    console.log("[REVIEWS API] Attempting to parse ID:", params.id, "to number:", courseId);

    if (isNaN(courseId)) {
      console.log("[REVIEWS API] Invalid course ID detected:", params.id, "is NaN:", isNaN(courseId));
      return Response.json({ error: "Invalid course ID" }, { status: 400, headers: { "Content-Type": "application/json" } })
    }

    console.log("[REVIEWS API] Parsed courseId:", courseId, "Type:", typeof courseId);
    console.log("[REVIEWS API] Executing database query for course ID:", courseId);

    const reviews = await sql`SELECT * FROM reviews WHERE course_id = ${courseId} ORDER BY created_at DESC`
    console.log("[REVIEWS API] Database query executed successfully");
    console.log("[REVIEWS API] Raw reviews result:", JSON.stringify(reviews, null, 2));
    console.log("[REVIEWS API] Number of reviews found:", reviews.length);

    console.log("[REVIEWS API] Returning reviews response with", reviews.length, "reviews");
    const response = Response.json(reviews, { headers: { "Content-Type": "application/json" } });
    console.log("[REVIEWS API] Response object created:", response.status);
    return response;
  } catch (error) {
    console.error("[REVIEWS API] Database error occurred:", error);
    console.error("[REVIEWS API] Error name:", (error as Error).name);
    console.error("[REVIEWS API] Error message:", (error as Error).message);
    console.error("[REVIEWS API] Error stack:", (error as Error).stack);

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
