import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

async function getUpcomingDrops(userId: string) {
  return prisma.drop.findMany({
    where: {
      userId,
      launchAt: {
        gte: new Date()
      }
    },
    orderBy: {
      launchAt: "asc"
    },
    take: 3,
    include: {
      tasks: true,
      _count: {
        select: { tasks: true }
      }
    }
  })
}

async function getTasksDueSoon(userId: string) {
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  return prisma.task.findMany({
    where: {
      drop: {
        userId
      },
      dueAt: {
        lte: sevenDaysFromNow,
        gte: new Date()
      },
      status: {
        not: "Done"
      }
    },
    orderBy: {
      dueAt: "asc"
    },
    take: 5,
    include: {
      drop: true
    }
  })
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const [upcomingDrops, tasksDueSoon] = await Promise.all([
    getUpcomingDrops(session.user.id),
    getTasksDueSoon(session.user.id)
  ])

  return (
    <DashboardOverview
      upcomingDrops={upcomingDrops}
      tasksDueSoon={tasksDueSoon}
    />
  )
}
