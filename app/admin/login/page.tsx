"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Attempting login with email:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log("[v0] Login response status:", response.status)

      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        console.log("[v0] Invalid response type:", contentType)
        setError("Server error. Please try again later.")
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log("[v0] Login response data:", data)

      if (response.ok) {
        router.push("/admin")
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
        <p className="text-slate-600 mb-8">Sign in to manage your courses</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm border border-red-300">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <Input
              type="email"
              placeholder="admin@fsl.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          <span className="font-semibold">Demo Credentials:</span>
          <br />
          Email: admin@fsl.com
          <br />
          Password: admin123
        </p>
      </Card>
    </div>
  )
}
