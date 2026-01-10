"use client"

import Link from "next/link"
import { format } from "date-fns"

interface DashboardOverviewProps {
  upcomingDrops: any[]
  tasksDueSoon: any[]
}

export function DashboardOverview({ upcomingDrops, tasksDueSoon }: DashboardOverviewProps) {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/drops/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Create Drop
        </Link>
      </div>

      {/* Upcoming Drops */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Drops</h2>
        {upcomingDrops.length > 0 ? (
          <div className="space-y-4">
            {upcomingDrops.map((drop) => {
              const completedTasks = drop.tasks.filter((t: any) => t.status === "Done").length
              const progress = drop.tasks.length > 0
                ? Math.round((completedTasks / drop.tasks.length) * 100)
                : 0

              return (
                <Link
                  key={drop.id}
                  href={`/drops/${drop.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{drop.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drop.status)}`}>
                      {drop.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{drop.description || "No description"}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Launch: {format(new Date(drop.launchAt), "MMM d, yyyy h:mm a")}</span>
                    <span>{drop._count.tasks} tasks ({progress}% complete)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No upcoming drops</p>
            <Link href="/drops/new" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
              Create your first drop
            </Link>
          </div>
        )}
      </div>

      {/* Tasks Due Soon */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks Due Soon</h2>
        {tasksDueSoon.length > 0 ? (
          <div className="space-y-3">
            {tasksDueSoon.map((task) => (
              <Link
                key={task.id}
                href={`/drops/${task.dropId}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Drop: {task.drop.title}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>
                      <span className="text-gray-500">
                        Due: {task.dueAt ? format(new Date(task.dueAt), "MMM d, yyyy") : "No due date"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks due soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
