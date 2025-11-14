import { neon } from "@neondatabase/serverless"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "FSL_SECRET")
    .digest("hex")
}

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()

    // Validate input
    if (!email || !username || !password) {
      return Response.json({ message: "Email, username, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username])

    if (existingUsers.length > 0) {
      return Response.json({ message: "Email or username already exists" }, { status: 409 })
    }

    // Create new user
    const passwordHash = hashPassword(password)
    const result = await sql(
      `INSERT INTO users (email, username, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, username`,
      [email, username, passwordHash, "user"],
    )

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ message: "Registration failed" }, { status: 500 })
  }
}
