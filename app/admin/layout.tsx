import type React from "react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  let authToken = null;
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name === "auth_token") {
      authToken = cookie.value;
      break;
    }
  }

  if (!authToken) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/courses" className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700">
            <BookOpen className="w-5 h-5" />
            <span>Courses</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700">
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-700">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-slate-50">
        {children}
      </main>
    </div>
  )
}
