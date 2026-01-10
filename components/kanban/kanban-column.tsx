"use client"

import { Drop, DropStatus } from "@prisma/client"
import { DropCard } from "./drop-card"

interface KanbanColumnProps {
  status: DropStatus
  title: string
  color: string
  drops: Drop[]
  onDropMove: (dropId: string, status: DropStatus) => void
}

export function KanbanColumn({ status, title, color, drops, onDropMove }: KanbanColumnProps) {
  return (
    <div className={`flex-shrink-0 w-80 border-2 rounded-lg p-4 ${color}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="bg-white rounded-full px-2 py-1 text-sm">
          {drops.length}
        </span>
      </div>

      <div className="space-y-3">
        {drops.map((drop) => (
          <DropCard
            key={drop.id}
            drop={drop}
            onStatusChange={(newStatus) => onDropMove(drop.id, newStatus)}
          />
        ))}

        {drops.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No drops in this column
          </div>
        )}
      </div>
    </div>
  )
}
