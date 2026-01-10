"use client"

import { Drop, DropStatus } from "@prisma/client"
import { KanbanColumn } from "./kanban-column"

interface KanbanBoardProps {
  drops: Drop[]
  onDropUpdate: (dropId: string, status: DropStatus) => void
}

export function KanbanBoard({ drops, onDropUpdate }: KanbanBoardProps) {
  const columns = [
    { status: "Planned" as DropStatus, title: "Planned", color: "bg-blue-100 border-blue-200" },
    { status: "InProgress" as DropStatus, title: "In Progress", color: "bg-yellow-100 border-yellow-200" },
    { status: "Ready" as DropStatus, title: "Ready", color: "bg-green-100 border-green-200" },
    { status: "Launched" as DropStatus, title: "Launched", color: "bg-purple-100 border-purple-200" },
    { status: "Archived" as DropStatus, title: "Archived", color: "bg-gray-100 border-gray-200" }
  ]

  const dropsByStatus = drops.reduce((acc, drop) => {
    if (!acc[drop.status]) acc[drop.status] = []
    acc[drop.status].push(drop)
    return acc
  }, {} as Record<DropStatus, Drop[]>)

  const handleDropMove = (dropId: string, newStatus: DropStatus) => {
    onDropUpdate(dropId, newStatus)
  }

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          title={column.title}
          color={column.color}
          drops={dropsByStatus[column.status] || []}
          onDropMove={handleDropMove}
        />
      ))}
    </div>
  )
}
