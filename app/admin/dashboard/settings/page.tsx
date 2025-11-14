"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface BankDetails {
  bank_name: string
  account_number: string
  transfer_instructions: string
  whatsapp_number: string
  whatsapp_enabled: boolean
}

export default function AdminSettingsPage() {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bank_name: "",
    account_number: "",
    transfer_instructions: "",
    whatsapp_number: "",
    whatsapp_enabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchBankDetails()
  }, [])

  const fetchBankDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setBankDetails({
          bank_name: data.bank_name || "",
          account_number: data.account_number || "",
          transfer_instructions: data.transfer_instructions || "",
          whatsapp_number: data.whatsapp_number || "",
          whatsapp_enabled: data.whatsapp_enabled || false,
        })
      } else {
        setError("Failed to fetch bank details.")
      }
    } catch (err) {
      console.error("Error fetching bank details:", err)
      setError("An error occurred while fetching bank details.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setBankDetails((prev) => ({ ...prev, whatsapp_enabled: checked }))
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
        body: JSON.stringify(bankDetails),
      })

      if (response.ok) {
        setSuccess("Bank details updated successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update bank details.")
      }
    } catch (err) {
      console.error("Error updating bank details:", err)
      setError("An error occurred while updating bank details.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button for mobile */}
        <div className="mb-6 lg:hidden">
          <Link href="/admin/dashboard">
            <button className="p-2 hover:bg-slate-100 rounded mb-4">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Bank Details Settings</h1>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-4 rounded">{success}</div>}

            <div>
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                name="bank_name"
                value={bankDetails.bank_name}
                onChange={handleChange}
                placeholder="e.g., First Bank of Nigeria"
              />
            </div>
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                name="account_number"
                value={bankDetails.account_number}
                onChange={handleChange}
                placeholder="e.g., 1234567890"
              />
            </div>
            <div>
              <Label htmlFor="transfer_instructions">Transfer Instructions</Label>
              <Textarea
                id="transfer_instructions"
                name="transfer_instructions"
                value={bankDetails.transfer_instructions}
                onChange={handleChange}
                placeholder="e.g., Please include your course title in the transfer description."
                rows={5}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h2 className="text-xl font-bold text-slate-900">WhatsApp Settings</h2>
              <div>
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={bankDetails.whatsapp_number}
                  onChange={handleChange}
                  placeholder="e.g., +2348012345678"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp_enabled">Enable WhatsApp Button</Label>
                <Switch
                  id="whatsapp_enabled"
                  checked={bankDetails.whatsapp_enabled}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>

            <Button type="submit" disabled={saving} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              {saving ? "Saving..." : "Save Bank Details"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
