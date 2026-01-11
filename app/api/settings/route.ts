import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const settingsSchema = z.object({
  emailReminders: z.boolean(),
  reminderEmail: z.string().email().optional().nullable()
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, settings: true }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Parse settings from JSON field or return defaults
    const settings = user.settings as any || {
      emailReminders: false,
      reminderEmail: user.email
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    // Update user settings in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: validatedData as any
      },
      select: { settings: true }
    })

    return NextResponse.json(updatedUser.settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 })
    }
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
