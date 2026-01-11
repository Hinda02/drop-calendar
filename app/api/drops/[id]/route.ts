import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { dropUpdateSchema } from "@/lib/validations"
import { z } from "zod"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const drop = await prisma.drop.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        tasks: {
          orderBy: [
            { priority: "desc" },
            { dueAt: "asc" }
          ]
        },
        reminders: true,
        _count: {
          select: { tasks: true }
        }
      }
    })

    if (!drop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 })
    }

    return NextResponse.json(drop)
  } catch (error) {
    console.error("Error fetching drop:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

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
    const validatedData = dropUpdateSchema.parse(body)

    // Check if drop exists and belongs to user
    const existingDrop = await prisma.drop.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingDrop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 })
    }

    const updatedDrop = await prisma.drop.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: validatedData,
      include: {
        tasks: true,
        _count: {
          select: { tasks: true }
        }
      }
    })

    return NextResponse.json(updatedDrop)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 })
    }
    console.error("Error updating drop:", error)
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

    // Check if drop exists and belongs to user
    const existingDrop = await prisma.drop.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingDrop) {
      return NextResponse.json({ error: "Drop not found" }, { status: 404 })
    }

    await prisma.drop.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting drop:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
