import { sql } from "@/lib/db";

// DELETE: Delete a category by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsObj = await params;
    const categoryId = parseInt(paramsObj.id, 10);

    if (isNaN(categoryId)) {
      return Response.json({ error: "Invalid category ID" }, { status: 400 });
    }

    // Check if category exists
    const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    // Delete the category
    await sql`DELETE FROM categories WHERE id = ${categoryId}`;

    return Response.json({ message: "Category deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Database error deleting category:", error);
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 });
  }
}

// PUT: Update a category by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const paramsObj = await params;
    const categoryId = parseInt(paramsObj.id, 10);

    if (isNaN(categoryId)) {
      return Response.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return Response.json({ error: "Category name is required" }, { status: 400 });
    }

    // Check if category exists
    const [category] = await sql`SELECT id FROM categories WHERE id = ${categoryId}`;
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    // Check if new name already exists (excluding current category)
    const [existingCategory] = await sql`
      SELECT id FROM categories 
      WHERE LOWER(name) = LOWER(${name}) AND id != ${categoryId}
    `;
    if (existingCategory) {
      return Response.json({ error: "Category name already exists" }, { status: 409 });
    }

    // Update the category
    const [updatedCategory] = await sql`
      UPDATE categories 
      SET name = ${name}, created_at = CURRENT_TIMESTAMP 
      WHERE id = ${categoryId} 
      RETURNING id, name, created_at
    `;

    return Response.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Database error updating category:", error);
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 });
  }
}