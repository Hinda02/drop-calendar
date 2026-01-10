"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { dropSchema } from "@/lib/validations"
import { z } from "zod"

type DropFormData = z.infer<typeof dropSchema>

interface DropFormProps {
  initialData?: any
  dropId?: string
}

export function DropForm({ initialData, dropId }: DropFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<DropFormData>({
    resolver: zodResolver(dropSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          launchAt: new Date(initialData.launchAt).toISOString().slice(0, 16)
        }
      : undefined
  })

  const onSubmit = async (data: DropFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const url = dropId ? `/api/drops/${dropId}` : "/api/drops"
      const method = dropId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Something went wrong")
        setIsLoading(false)
        return
      }

      const drop = await response.json()
      router.push(`/drops/${drop.id}`)
      router.refresh()
    } catch (error) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Summer Collection Launch"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your product drop..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="launchAt" className="block text-sm font-medium text-gray-700 mb-2">
          Launch Date & Time *
        </label>
        <input
          type="datetime-local"
          id="launchAt"
          {...register("launchAt")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.launchAt && (
          <p className="mt-1 text-sm text-red-600">{errors.launchAt.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-2">
          Channel *
        </label>
        <select
          id="channel"
          {...register("channel")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a channel</option>
          <option value="Website">Website</option>
          <option value="TikTok">TikTok</option>
          <option value="Snapchat">Snapchat</option>
          <option value="Instagram">Instagram</option>
          <option value="Retail">Retail</option>
          <option value="Other">Other</option>
        </select>
        {errors.channel && (
          <p className="mt-1 text-sm text-red-600">{errors.channel.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Planned">Planned</option>
          <option value="InProgress">In Progress</option>
          <option value="Ready">Ready</option>
          <option value="Launched">Launched</option>
          <option value="Archived">Archived</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : dropId ? "Update Drop" : "Create Drop"}
        </button>
      </div>
    </form>
  )
}
