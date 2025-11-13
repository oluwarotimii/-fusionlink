"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSeedData = async () => {
    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Demo data seeded successfully!")
      } else {
        setError(data.error || "Failed to seed data")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("[v0] Error seeding data:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/admin">
            <button className="p-2 hover:bg-slate-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Seed Demo Data</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Populate Demo Data</h2>
            <p className="text-slate-600 mb-6">
              Click the button below to populate your database with sample courses and data for testing.
            </p>
          </div>

          {message && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{message}</div>}
          {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

          <Button
            onClick={handleSeedData}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3"
            disabled={loading}
          >
            {loading ? "Seeding Data..." : "Seed Demo Data"}
          </Button>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold text-slate-900 mb-4">What will be created:</h3>
            <ul className="space-y-2 text-slate-700">
              <li>6 sample courses across different categories</li>
              <li>Sample reviews for each course</li>
              <li>Admin user (admin@fsl.com / admin123)</li>
              <li>Test data for development and testing</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
