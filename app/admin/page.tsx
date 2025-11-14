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
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Courses</p>
              <p className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2">{stats.courses}</p>
            </div>
            <BookOpen className="w-8 sm:w-12 h-8 sm:h-12 text-yellow-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Users</p>
              <p className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2">{stats.users}</p>
            </div>
            <Users className="w-8 sm:w-12 h-8 sm:h-12 text-blue-800 opacity-20" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-xs sm:text-sm font-medium">Total Enrollments</p>
              <p className="text-2xl sm:text-4xl font-bold text-slate-900 mt-2">{stats.enrollments}</p>
            </div>
            <BarChart3 className="w-8 sm:w-12 h-8 sm:h-12 text-blue-800 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Link href="/admin/courses">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base">
              Manage Courses
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base">
              Manage Categories
            </Button>
          </Link>
          <Link href="/admin/change-password">
            <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base">
              Change Password
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base">
              Bank Details Settings
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
