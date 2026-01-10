import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { KanbanClient } from "@/components/kanban/kanban-client"

async function getDrops(userId: string) {
  return prisma.drop.findMany({
    where: { userId },
    include: {
      tasks: true,
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: "desc" }
  })
}

export default async function KanbanPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const drops = await getDrops(session.user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Kanban Board</h1>
      <KanbanClient initialDrops={drops} />
    </div>
  )
}
