"use client"

import { useState } from "react"
import { Task } from "@prisma/client"
import { format } from "date-fns"
import { TaskForm } from "./task-form"

interface TaskListProps {
  tasks: Task[]
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        onDelete(taskId)
      } else {
        alert("Failed to delete task")
      }
    } catch (error) {
      alert("An error occurred")
    }
  }

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: newStatus })
      })

      if (response.ok) {
        const updatedTask = await response.json()
        onUpdate(updatedTask)
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50"
      case "Medium":
        return "text-yellow-600 bg-yellow-50"
      case "Low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800"
      case "Doing":
        return "bg-blue-100 text-blue-800"
      case "Done":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const tasksByStatus = {
    Todo: tasks.filter(t => t.status === "Todo"),
    Doing: tasks.filter(t => t.status === "Doing"),
    Done: tasks.filter(t => t.status === "Done")
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
        <div key={status}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {status} ({statusTasks.length})
          </h3>

          <div className="space-y-3">
            {statusTasks.map((task) => (
              <div key={task.id}>
                {editingTaskId === task.id ? (
                  <TaskForm
                    dropId={task.dropId}
                    initialData={task}
                    taskId={task.id}
                    onSuccess={(updatedTask) => {
                      onUpdate(updatedTask)
                      setEditingTaskId(null)
                    }}
                    onCancel={() => setEditingTaskId(null)}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingTaskId(task.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {task.category}
                      </span>
                    </div>

                    {task.notes && (
                      <p className="text-sm text-gray-600 mb-3">{task.notes}</p>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      {task.dueAt ? (
                        <span className="text-gray-500">
                          Due: {format(new Date(task.dueAt), "MMM d, yyyy h:mm a")}
                        </span>
                      ) : (
                        <span className="text-gray-400">No due date</span>
                      )}

                      <div className="flex space-x-2">
                        {task.status !== "Todo" && (
                          <button
                            onClick={() => handleStatusChange(task, "Todo")}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                          >
                            → To Do
                          </button>
                        )}
                        {task.status !== "Doing" && (
                          <button
                            onClick={() => handleStatusChange(task, "Doing")}
                            className="px-3 py-1 text-xs border border-blue-300 rounded hover:bg-blue-50"
                          >
                            → Doing
                          </button>
                        )}
                        {task.status !== "Done" && (
                          <button
                            onClick={() => handleStatusChange(task, "Done")}
                            className="px-3 py-1 text-xs border border-green-300 rounded hover:bg-green-50"
                          >
                            → Done
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
