"use client"

import { format } from "date-fns"
import Link from "next/link"

interface DropDrawerProps {
  drop: any
  isOpen: boolean
  onClose: () => void
}

export function DropDrawer({ drop, isOpen, onClose }: DropDrawerProps) {
  if (!isOpen || !drop) return null

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

  const completedTasks = drop.tasks?.filter((t: any) => t.status === "Done").length || 0
  const totalTasks = drop.tasks?.length || 0
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{drop.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drop.status)}`}>
                {drop.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 text-gray-900">{drop.description || "No description"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Launch Date</h3>
              <p className="mt-1 text-gray-900">
                {format(new Date(drop.launchAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Channel</h3>
              <p className="mt-1 text-gray-900">{drop.channel}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {completedTasks} of {totalTasks} tasks completed ({progress}%)
              </p>
            </div>

            <div className="pt-4">
              <Link
                href={`/drops/${drop.id}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
