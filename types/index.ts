// types/index.ts
import { Drop, Task, User, Reminder, DropStatus, DropChannel, TaskCategory, TaskStatus, TaskPriority } from "@prisma/client"

// Drop with relations
export interface DropWithTasks extends Drop {
  tasks: Task[]
  _count: {
    tasks: number
  }
}

export interface DropWithRelations extends Drop {
  tasks: Task[]
  reminders: Reminder[]
  _count: {
    tasks: number
  }
}

// Task with drop
export interface TaskWithDrop extends Task {
  drop: Drop
}

// User session
export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

// Settings
export interface UserSettings {
  emailReminders: boolean
  reminderEmail: string
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiError {
  error: string
  details?: any
}
