import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DropDetailClient } from "./client"

async function getDrop(id: string, userId: string) {
  return prisma.drop.findUnique({
    where: { id, userId },
    include: {
      tasks: {
        orderBy: [
          { priority: "desc" },
          { dueAt: "asc" },
          { createdAt: "asc" }
        ]
      },
      reminders: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
}

export default async function DropDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const drop = await getDrop(params.id, session.user.id)
  if (!drop) {
    notFound()
  }

  const completedTasks = drop.tasks.filter(task => task.status === "Done").length
  const progress = drop.tasks.length > 0 ? Math.round((completedTasks / drop.tasks.length) * 100) : 0

  return (
    <DropDetailClient
      drop={drop}
      progress={progress}
      completedTasks={completedTasks}
      totalTasks={drop.tasks.length}
    />
  )
}
