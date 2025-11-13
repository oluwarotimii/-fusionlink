"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface SocialLinks {
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
}

export default function AdminSettingsPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSocialLinks(data)
      } else {
        setError("Failed to fetch social links.")
      }
    } catch (err) {
      console.error("Error fetching social links:", err)
      setError("An error occurred while fetching social links.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socialLinks),
      })

      if (response.ok) {
        setSuccess("Social links updated successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update social links.")
      }
    } catch (err) {
      console.error("Error updating social links:", err)
      setError("An error occurred while updating social links.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-4 rounded">{success}</div>}

          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input
              id="facebook"
              name="facebook"
              value={socialLinks.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              name="twitter"
              value={socialLinks.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              name="instagram"
              value={socialLinks.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourprofile"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={socialLinks.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Social Links"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
