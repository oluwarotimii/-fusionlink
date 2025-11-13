import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const [settings] = await sql`SELECT facebook_url, twitter_url, instagram_url, linkedin_url FROM settings LIMIT 1`

    if (!settings) {
      return Response.json({
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      })
    }

    return Response.json({
      facebook: settings.facebook_url || "",
      twitter: settings.twitter_url || "",
      instagram: settings.instagram_url || "",
      linkedin: settings.linkedin_url || "",
    })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { facebook, twitter, instagram, linkedin } = body

    // Check if settings record exists, if not, insert, else update
    const [existingSettings] = await sql`SELECT id FROM settings LIMIT 1`

    if (existingSettings) {
      await sql`UPDATE settings SET
        facebook_url = ${facebook},
        twitter_url = ${twitter},
        instagram_url = ${instagram},
        linkedin_url = ${linkedin}
      WHERE id = ${existingSettings.id}`
    } else {
      await sql`INSERT INTO settings (facebook_url, twitter_url, instagram_url, linkedin_url)
      VALUES (${facebook}, ${twitter}, ${instagram}, ${linkedin})`
    }

    return Response.json({ message: "Social links updated successfully!" })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
