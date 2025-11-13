import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const [coursesCount] = await sql("SELECT COUNT(*) FROM courses WHERE is_active = true")
    const [usersCount] = await sql("SELECT COUNT(*) FROM users WHERE role = $1", ["user"])
    const [enrollmentsCount] = await sql("SELECT COUNT(*) FROM enrollments")

    return Response.json({
      courses: coursesCount.count,
      users: usersCount.count,
      enrollments: enrollmentsCount.count,
    })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ courses: 0, users: 0, enrollments: 0 })
  }
}
