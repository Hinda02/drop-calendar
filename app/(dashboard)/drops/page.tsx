import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DropsListClient } from "@/components/drops/drops-list-client"

async function getDrops(userId: string) {
  return prisma.drop.findMany({
    where: { userId },
    include: {
      tasks: true,
      _count: { select: { tasks: true } }
    },
    orderBy: { launchAt: "desc" }
  })
}

export default async function DropsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const drops = await getDrops(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Drops</h1>
      </div>
      <DropsListClient initialDrops={drops} />
    </div>
  )
}
