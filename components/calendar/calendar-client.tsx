"use client"

import { useState } from "react"
import { CalendarView } from "./calendar-view"
import { DropDrawer } from "@/components/drops/drop-drawer"

interface CalendarClientProps {
  drops: any[]
}

export function CalendarClient({ drops }: CalendarClientProps) {
  const [selectedDrop, setSelectedDrop] = useState<any>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDropClick = (drop: any) => {
    setSelectedDrop(drop)
    setIsDrawerOpen(true)
  }

  return (
    <>
      <CalendarView drops={drops} onDropClick={handleDropClick} />
      <DropDrawer
        drop={selectedDrop}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
