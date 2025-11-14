"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Course {
  id: number
  title: string
  instructor_name: string
  price: number
  category: string
  is_active: boolean
}

export default function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [searchTerm, courses])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
        setFilteredCourses(data)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses)
      return
    }

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCourses(filtered)
  }

  const deleteCourse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return
    try {
      const response = await fetch(`/api/courses/${id}`, { method: "DELETE" })
      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== id))
      }
    } catch (error) {
      console.error("Error deleting course:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <button className="p-2 hover:bg-slate-100 rounded">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Manage Courses</h1>
          </div>
          <Link href="/admin/courses/new">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search courses by title, instructor, or category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        {loading ? (
          <p className="text-slate-600">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 mb-4">
              {searchTerm ? "No courses found matching your search" : "No courses found"}
            </p>
            <Link href="/admin/courses/new">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Create First Course</Button>
            </Link>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Instructor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.instructor_name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.category}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ${course.price ? Number(course.price).toFixed(2) : "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          course.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {course.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/courses/${course.id}`}>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  )
}
