import { cookies } from "next/headers"

interface AuthUser {
  id: number
  email: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return null
    }

    const decoded = JSON.parse(Buffer.from(token, "base64").toString())
    return decoded
  } catch (error) {
    console.error("[v0] Error decoding auth token:", error)
    return null
  }
}
