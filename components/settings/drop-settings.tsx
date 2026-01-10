"use client"

import { useState, useEffect } from "react"

interface UserSettings {
  emailReminders: boolean
  reminderEmail: string
}

export function DropSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    emailReminders: false,
    reminderEmail: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert("Settings saved successfully!")
      } else {
        alert("Error saving settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <div className="p-6">Loading settings...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold">Email Reminders</h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="emailReminders"
            checked={settings.emailReminders}
            onChange={(e) => handleInputChange("emailReminders", e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="emailReminders" className="text-sm font-medium">
            Enable email reminders
          </label>
        </div>

        {settings.emailReminders && (
          <div>
            <label htmlFor="reminderEmail" className="block text-sm font-medium mb-2">
              Reminder Email
            </label>
            <input
              type="email"
              id="reminderEmail"
              value={settings.reminderEmail}
              onChange={(e) => handleInputChange("reminderEmail", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
