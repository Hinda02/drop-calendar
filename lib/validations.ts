// lib/validations.ts
import { z } from "zod"
import { DropStatus, DropChannel, TaskCategory, TaskStatus, TaskPriority } from "@prisma/client"

export const dropSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  launchAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }),
  status: z.nativeEnum(DropStatus).optional(),
  channel: z.nativeEnum(DropChannel),
  tags: z.array(z.string()).optional().default([])
})

// Partial schema for updates (all fields optional)
export const dropUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100).optional(),
  description: z.string().optional(),
  launchAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  status: z.nativeEnum(DropStatus).optional(),
  channel: z.nativeEnum(DropChannel).optional(),
  tags: z.array(z.string()).optional()
})

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  category: z.nativeEnum(TaskCategory),
  dueAt: z.string().optional().nullable(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  notes: z.string().optional()
})

export const reminderSchema = z.object({
  type: z.enum(["DaysBefore", "AtTime"]),
  value: z.number().min(1),
  email: z.string().email().optional().nullable(),
  isActive: z.boolean().optional().default(true)
})
