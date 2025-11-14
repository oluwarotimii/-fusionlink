"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password changed successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(data.message || "Failed to change password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button for mobile */}
        <div className="mb-6 lg:hidden">
          <Link href="/admin">
            <button className="p-2 hover:bg-slate-100 rounded mb-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
        </div>
        <Card className="p-8">
          <form onSubmit={handleChangePassword} className="space-y-6">
            {message && <div className="bg-green-100 text-green-700 p-4 rounded">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <Input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3"
              disabled={loading}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
