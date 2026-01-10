import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DropForm } from "@/components/drops/drop-form"

async function getDrop(id: string, userId: string) {
  return prisma.drop.findUnique({
    where: { id, userId }
  })
}

export default async function EditDropPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const drop = await getDrop(params.id, session.user.id)
  if (!drop) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Drop</h1>
      <DropForm initialData={drop} dropId={drop.id} />
    </div>
  )
}
