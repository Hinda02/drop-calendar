"use client"

import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DropHeaderProps {
  drop: any
}

export function DropHeader({ drop }: DropHeaderProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned":
        return "bg-blue-100 text-blue-800"
      case "InProgress":
        return "bg-yellow-100 text-yellow-800"
      case "Ready":
        return "bg-green-100 text-green-800"
      case "Launched":
        return "bg-purple-100 text-purple-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this drop? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/drops/${drop.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        router.push("/drops")
        router.refresh()
      } else {
        alert("Failed to delete drop")
        setIsDeleting(false)
      }
    } catch (error) {
      alert("An error occurred")
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{drop.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(drop.status)}`}>
            {drop.status}
          </span>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/drops/${drop.id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="space-y-3 text-gray-700">
        <div>
          <span className="font-medium">Description:</span> {drop.description || "No description"}
        </div>
        <div>
          <span className="font-medium">Launch Date:</span> {format(new Date(drop.launchAt), "MMMM d, yyyy 'at' h:mm a")}
        </div>
        <div>
          <span className="font-medium">Channel:</span> {drop.channel}
        </div>
        {drop.tags && drop.tags.length > 0 && (
          <div>
            <span className="font-medium">Tags:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {drop.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
