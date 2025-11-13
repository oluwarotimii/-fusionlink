import { neon } from "@neondatabase/serverless"
import crypto from "crypto"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + "FSL_SECRET")
    .digest("hex")
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Decode token to get user email
    const userEmail = JSON.parse(Buffer.from(token, "base64").toString()).email

    const users = await sql("SELECT * FROM users WHERE email = $1", [userEmail])
    if (users.length === 0) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const currentHash = hashPassword(currentPassword)
    if (users[0].password_hash !== currentHash) {
      return Response.json({ message: "Current password is incorrect" }, { status: 401 })
    }

    const newHash = hashPassword(newPassword)
    await sql("UPDATE users SET password_hash = $1 WHERE email = $2", [newHash, userEmail])

    return Response.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    return Response.json({ message: "Failed to change password" }, { status: 500 })
  }
}
