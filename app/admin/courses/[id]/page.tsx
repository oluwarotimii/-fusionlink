"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

interface Course {
  id: number
  title: string
  description: string
  instructor_name: string
  instructor_image_url: string
  price: number
  original_price: number
  discount_percentage: number
  category: string
  image_url: string
  video_url: string
  duration_hours: number
  total_lectures: number
  total_sections: number
  total_students: number
  language: string
}

export default function EditCoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState<Course | null>(null)

  useEffect(() => {
    fetchCourse()
  }, [])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setFormData(data)
      } else {
        setError("Course not found")
      }
    } catch (err) {
      setError("Failed to load course")
      console.error("[v0] Error fetching course:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: [
              "price",
              "original_price",
              "discount_percentage",
              "duration_hours",
              "total_lectures",
              "total_sections",
              "total_students",
            ].includes(name)
              ? Number.parseFloat(value) || 0
              : value,
          }
        : null,
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Course updated successfully!")
        setTimeout(() => router.push("/admin/courses"), 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update course")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("[v0] Error updating course:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading course...</p>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-red-600">{error || "Course not found"}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/admin/courses">
            <button className="p-2 hover:bg-slate-100 rounded">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Course</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-4 rounded">{success}</div>}

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course Title</label>
                <Input name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
              </div>
            </div>

            {/* Instructor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructor Name</label>
                <Input name="instructor_name" value={formData.instructor_name} onChange={handleChange} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instructor Image URL</label>
                <Input name="instructor_image_url" value={formData.instructor_image_url} onChange={handleChange} />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price ($)</label>
                <Input name="price" type="number" value={formData.price} onChange={handleChange} step="0.01" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Original Price ($)</label>
                <Input
                  name="original_price"
                  type="number"
                  value={formData.original_price}
                  onChange={handleChange}
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Discount (%)</label>
                <Input
                  name="discount_percentage"
                  type="number"
                  value={formData.discount_percentage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Development</option>
                  <option>Design</option>
                  <option>Mobile</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <Input name="language" value={formData.language} onChange={handleChange} />
              </div>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Course Image URL</label>
                <Input name="image_url" value={formData.image_url} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Video URL</label>
                <Input name="video_url" value={formData.video_url} onChange={handleChange} />
              </div>
            </div>

            {/* Course Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Duration (hours)</label>
                <Input
                  name="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={handleChange}
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Sections</label>
                <Input name="total_sections" type="number" value={formData.total_sections} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Lectures</label>
                <Input name="total_lectures" type="number" value={formData.total_lectures} onChange={handleChange} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Students</label>
                <Input name="total_students" type="number" value={formData.total_students} onChange={handleChange} />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/admin/courses" className="flex-1">
                <Button variant="outline" className="w-full py-3 bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
