import { sql } from "@/lib/db";

export async function GET() {
  try {
    const [settings] = await sql`SELECT bank_name, account_number, transfer_instructions, whatsapp_number, whatsapp_enabled FROM settings LIMIT 1`

    if (!settings) {
      return Response.json({
        bank_name: "",
        account_number: "",
        transfer_instructions: "",
        whatsapp_number: "",
        whatsapp_enabled: false,
      })
    }

    return Response.json({
      bank_name: settings.bank_name || "",
      account_number: settings.account_number || "",
      transfer_instructions: settings.transfer_instructions || "",
      whatsapp_number: settings.whatsapp_number || "",
      whatsapp_enabled: settings.whatsapp_enabled || false,
    })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { bank_name, account_number, transfer_instructions, whatsapp_number, whatsapp_enabled } = body

    // Check if settings record exists, if not, insert, else update
    const [existingSettings] = await sql`SELECT id FROM settings LIMIT 1`

    if (existingSettings) {
      await sql`UPDATE settings SET
        bank_name = ${bank_name},
        account_number = ${account_number},
        transfer_instructions = ${transfer_instructions},
        whatsapp_number = ${whatsapp_number},
        whatsapp_enabled = ${whatsapp_enabled}
      WHERE id = ${existingSettings.id}`
    } else {
      await sql`INSERT INTO settings (bank_name, account_number, transfer_instructions, whatsapp_number, whatsapp_enabled)
      VALUES (${bank_name}, ${account_number}, ${transfer_instructions}, ${whatsapp_number}, ${whatsapp_enabled})`
    }

    return Response.json({ message: "Bank details updated successfully!" })
  } catch (error) {
    console.error("Database error:", error)
    return Response.json({ message: "Server error. Please try again later." }, { status: 500 })
  }
}
