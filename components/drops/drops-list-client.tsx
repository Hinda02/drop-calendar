"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"

interface DropsListClientProps {
  initialDrops: any[]
}

export function DropsListClient({ initialDrops }: DropsListClientProps) {
  const [drops, setDrops] = useState(initialDrops)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [channelFilter, setChannelFilter] = useState("")

  const filteredDrops = drops.filter((drop) => {
    const matchesSearch =
      drop.title.toLowerCase().includes(search.toLowerCase()) ||
      (drop.description?.toLowerCase() || "").includes(search.toLowerCase())
    const matchesStatus = !statusFilter || drop.status === statusFilter
    const matchesChannel = !channelFilter || drop.channel === channelFilter
    return matchesSearch && matchesStatus && matchesChannel
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-800"
      case "InProgress":
        return "bg-yellow-100 text-yellow-800"
      case "Ready":
        return "bg-green-100 text-green-800"
      case "Launched":
        return "bg-purple-100 text-purple-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search drops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="InProgress">In Progress</option>
            <option value="Ready">Ready</option>
            <option value="Launched">Launched</option>
            <option value="Archived">Archived</option>
          </select>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Channels</option>
            <option value="Website">Website</option>
            <option value="TikTok">TikTok</option>
            <option value="Snapchat">Snapchat</option>
            <option value="Instagram">Instagram</option>
            <option value="Retail">Retail</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Create Drop Button */}
      <div className="flex justify-end">
        <Link
          href="/drops/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Drop
        </Link>
      </div>

      {/* Drops List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredDrops.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredDrops.map((drop) => {
              const completedTasks = drop.tasks.filter((t: any) => t.status === "Done").length
              const progress = drop.tasks.length > 0
                ? Math.round((completedTasks / drop.tasks.length) * 100)
                : 0

              return (
                <Link
                  key={drop.id}
                  href={`/drops/${drop.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{drop.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(drop.status)}`}>
                      {drop.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{drop.description || "No description"}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span>Launch: {format(new Date(drop.launchAt), "MMM d, yyyy h:mm a")}</span>
                    <span>Channel: {drop.channel}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {drop._count.tasks} tasks ({progress}% complete)
                  </p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No drops found</p>
            <Link href="/drops/new" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              Create your first drop
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
