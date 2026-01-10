import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CalendarClient } from "@/components/calendar/calendar-client"

async function getDrops(userId: string) {
  return prisma.drop.findMany({
    where: { userId },
    include: {
      tasks: true,
      _count: { select: { tasks: true } }
    },
    orderBy: { launchAt: "asc" }
  })
}

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const drops = await getDrops(session.user.id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Calendar View</h1>
      <CalendarClient drops={drops} />
    </div>
  )
}
