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
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ message: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Authenticating user:", email)
    const users = await sql("SELECT * FROM users WHERE email = $1 AND role = $2", [email, "admin"])
    console.log("[v0] Query result:", users.length > 0 ? "User found" : "User not found")

    if (users.length === 0) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]
    const passwordHash = hashPassword(password)

    if (user.password_hash !== passwordHash) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Set HTTP-only cookie
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64")
    const response = Response.json({ success: true, message: "Login successful" }, { status: 200 })
    response.headers.set("Set-Cookie", `auth_token=${token}; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict`)

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    const response = Response.json({ message: "Server error. Please try again later." }, { status: 500 })
    response.headers.set("Content-Type", "application/json")
    return response
  }
}
