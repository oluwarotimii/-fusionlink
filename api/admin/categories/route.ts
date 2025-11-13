import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`SELECT id, name FROM categories ORDER BY name ASC`
    return Response.json(categories)
  } catch (error) {
    console.error("Database error fetching categories:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return Response.json({ error: "Category name is required" }, { status: 400 })
    }

    const [existingCategory] = await sql`SELECT id FROM categories WHERE name = ${name}`
    if (existingCategory) {
      return Response.json({ error: "Category already exists" }, { status: 409 })
    }

    const [newCategory] = await sql`INSERT INTO categories (name) VALUES (${name}) RETURNING id, name`
    return Response.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Database error adding category:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
