// prisma/seed.ts
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12)

  const user = await prisma.user.create({
    data: {
      email: "demo@example.com",
      name: "Demo User",
      password: hashedPassword,
    },
  })

  const demoDrop = await prisma.drop.create({
    data: {
      title: "Summer Collection Launch",
      description: "New summer fashion line launch",
      launchAt: new Date("2024-06-15T10:00:00Z"),
      status: "Planned",
      channel: "Website",
      userId: user.id,
      tasks: {
        create: [
          {
            title: "Product photoshoot",
            category: "Photoshoot",
            dueAt: new Date("2024-06-10T14:00:00Z"),
            priority: "High",
            notes: "Book photographer and studio"
          },
          {
            title: "Social media content",
            category: "Content",
            dueAt: new Date("2024-06-08T16:00:00Z"),
            priority: "Medium",
            notes: "Create 10 posts and stories"
          },
          {
            title: "Shipping preparation",
            category: "Shipping",
            dueAt: new Date("2024-06-12T10:00:00Z"),
            priority: "Medium",
            notes: "Pack and ship samples"
          }
        ]
      }
    }
  })

  console.log("Database seeded successfully!")
  console.log("Demo user created:", user.email)
  console.log("Demo drop created:", demoDrop.title)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
