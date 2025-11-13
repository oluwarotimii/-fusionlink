"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Users, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, users: 0, enrollments: 0 })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Courses</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{stats.courses}</p>
            </div>
            <BookOpen className="w-12 h-12 text-teal-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{stats.users}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Enrollments</p>
              <p className="text-4xl font-bold text-slate-900 mt-2">{stats.enrollments}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/admin/courses">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3">
              Manage Courses
            </Button>
          </Link>
          <Link href="/admin/change-password">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3">
              Change Password
            </Button>
          </Link>
          <Link href="/admin/seed-data">
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3">
              Seed Demo Data
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
