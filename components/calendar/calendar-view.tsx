"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { Drop } from "@prisma/client"

interface CalendarViewProps {
  drops: Drop[]
  onDropClick: (drop: Drop) => void
}

export function CalendarView({ drops, onDropClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const dropsByDate = drops.reduce((acc, drop) => {
    const date = format(new Date(drop.launchAt), "yyyy-MM-dd")
    if (!acc[date]) acc[date] = []
    acc[date].push(drop)
    return acc
  }, {} as Record<string, Drop[]>)

  const getDropsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return dropsByDate[dateStr] || []
  }

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const dayDrops = getDropsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isToday = isSameDay(day, new Date())

          return (
            <div
              key={index}
              className={`
                min-h-24 p-2 border rounded-lg
                ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}
                ${isToday ? "border-blue-500 border-2" : "border-gray-200"}
              `}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayDrops.slice(0, 3).map((drop) => (
                  <button
                    key={drop.id}
                    onClick={() => onDropClick(drop)}
                    className={`
                      w-full text-xs p-1 rounded text-left truncate
                      ${getStatusColor(drop.status)}
                    `}
                    title={drop.title}
                  >
                    {drop.title}
                  </button>
                ))}
                {dayDrops.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayDrops.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
