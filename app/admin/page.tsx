"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, Users, BookOpen, LogOut } from "lucide-react"
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

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Courses</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.courses}</p>
              </div>
              <BookOpen className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.users}</p>
              </div>
              <Users className="w-12 h-12 text-blue-800 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Enrollments</p>
                <p className="text-4xl font-bold text-slate-900 mt-2">{stats.enrollments}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-800 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/courses">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3">
                Manage Courses
              </Button>
            </Link>
            <Link href="/admin/change-password">
              <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3">
                Change Password
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
