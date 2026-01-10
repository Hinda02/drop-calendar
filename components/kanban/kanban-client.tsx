"use client"

import { useState } from "react"
import { DropStatus } from "@prisma/client"
import { KanbanBoard } from "./kanban-board"
import { useRouter } from "next/navigation"

interface KanbanClientProps {
  initialDrops: any[]
}

export function KanbanClient({ initialDrops }: KanbanClientProps) {
  const [drops, setDrops] = useState(initialDrops)
  const router = useRouter()

  const handleDropUpdate = async (dropId: string, newStatus: DropStatus) => {
    try {
      const response = await fetch(`/api/drops/${dropId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const updatedDrop = await response.json()
        setDrops(prevDrops =>
          prevDrops.map(drop =>
            drop.id === dropId ? { ...drop, status: newStatus } : drop
          )
        )
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating drop:", error)
    }
  }

  return <KanbanBoard drops={drops} onDropUpdate={handleDropUpdate} />
}
