import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { taskSchema } from "@/lib/validations"
import { z } from "zod"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = taskSchema.parse(body)

    // Verify task belongs to user's drop
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { drop: true }
    })

    if (!existingTask || existingTask.drop.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 })
    }
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify task belongs to user's drop
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
      include: { drop: true }
    })

    if (!existingTask || existingTask.drop.userId !== session.user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
