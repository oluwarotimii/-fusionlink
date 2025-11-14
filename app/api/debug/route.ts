import { sql } from "@/lib/db";

export async function GET() {
  try {
    console.log("Debug: Testing database connection...")

    // Test connection
    const connectionTest = await sql("SELECT 1 as test")
    console.log("Debug: Connection successful")

    // Check tables
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log("Debug: Tables found:", tables.length)

    // Check users
    const users = await sql("SELECT COUNT(*) as count FROM users")
    console.log("Debug: Users in database:", users[0])

    // Check courses
    const courses = await sql("SELECT COUNT(*) as count FROM courses")
    console.log("Debug: Courses in database:", courses[0])

    // Check reviews
    const reviews = await sql("SELECT COUNT(*) as count FROM reviews")
    console.log("Debug: Reviews in database:", reviews[0])

    const response = Response.json({
      status: "ok",
      connection: "connected",
      database: {
        tables: tables.length,
        users: users[0].count,
        courses: courses[0].count,
        reviews: reviews[0].count,
      },
    })
    response.headers.set("Content-Type", "application/json")
    return response
  } catch (error) {
    console.error("Debug error:", error)
    const response = Response.json({
      status: "error",
      message: String(error),
      details: error instanceof Error ? error.message : "Unknown error",
    })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}
