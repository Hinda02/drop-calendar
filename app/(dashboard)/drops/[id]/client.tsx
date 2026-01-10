"use client"

import { useState } from "react"
import { Drop, Task } from "@prisma/client"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskList } from "@/components/tasks/task-list"
import { DropHeader } from "@/components/drops/drop-header"
import { ProgressWidget } from "@/components/ui/progress-widget"

interface DropDetailClientProps {
  drop: Drop & {
    tasks: Task[]
    _count: { tasks: number }
  }
  progress: number
  completedTasks: number
  totalTasks: number
}

export function DropDetailClient({
  drop,
  progress: initialProgress,
  completedTasks: initialCompleted,
  totalTasks: initialTotal
}: DropDetailClientProps) {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [tasks, setTasks] = useState(drop.tasks)

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskCreate = (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const completed = tasks.filter(task => task.status === "Done").length
  const newProgress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      <DropHeader drop={drop} />

      <ProgressWidget
        title="Task Progress"
        progress={newProgress}
        description={`${completed} of ${tasks.length} tasks completed`}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {showTaskForm && (
        <TaskForm
          dropId={drop.id}
          onSuccess={handleTaskCreate}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      <TaskList
        tasks={tasks}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  )
}
