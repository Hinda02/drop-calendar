"use client"

import { Drop, DropStatus } from "@prisma/client"
import { format } from "date-fns"
import Link from "next/link"
import { useState } from "react"

interface DropCardProps {
  drop: Drop & { tasks?: any[], _count?: { tasks: number } }
  onStatusChange: (newStatus: DropStatus) => void
}

export function DropCard({ drop, onStatusChange }: DropCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const statuses: DropStatus[] = ["Planned", "InProgress", "Ready", "Launched", "Archived"]

  const completedTasks = drop.tasks?.filter((t: any) => t.status === "Done").length || 0
  const totalTasks = drop.tasks?.length || drop._count?.tasks || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <Link
          href={`/drops/${drop.id}`}
          className="font-semibold text-gray-900 hover:text-blue-600 flex-1"
        >
          {drop.title}
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {statuses
                .filter(s => s !== drop.status)
                .map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(status)
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Move to {status}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {drop.description || "No description"}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <span>{format(new Date(drop.launchAt), "MMM d, yyyy")}</span>
        <span>{drop.channel}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {totalTasks} tasks ({progress}% complete)
      </p>
    </div>
  )
}
