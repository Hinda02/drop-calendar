// app/api/drops/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { dropSchema } from "@/lib/validations"
import { z } from "zod"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const channel = searchParams.get("channel")
    const sortBy = searchParams.get("sortBy") || "launchAt"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    const where: any = {
      userId: session.user.id
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (status) where.status = status
    if (channel) where.channel = channel

    const [drops, total] = await Promise.all([
      prisma.drop.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder
        },
        include: {
          tasks: true,
          _count: {
            select: { tasks: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.drop.count({ where })
    ])

    return NextResponse.json({
      drops,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching drops:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = dropSchema.parse(body)

    const drop = await prisma.drop.create({
      data: {
        ...validatedData,
        userId: session.user.id
      },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true }
        }
      }
    })

    return NextResponse.json(drop, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation Error", details: error.errors }, { status: 400 })
    }
    console.error("Error creating drop:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
