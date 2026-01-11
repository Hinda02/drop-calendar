import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { taskSchema } from "@/lib/validations"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { dropId, ...taskData } = body
    const validatedData = taskSchema.parse(taskData)

    // Verify drop belongs to user
    const drop = await prisma.drop.findUnique({
      where: {
        id: dropId,
        userId: session.user.id
      }
    })

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        dropId
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 })
    }
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
