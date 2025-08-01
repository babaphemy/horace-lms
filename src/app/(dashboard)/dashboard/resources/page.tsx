"use client"

import {
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Play,
  Search,
  Tag,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
type ResourceType = "video" | "document" | "blog" | "article"
export type Resource = {
  id: number
  title: string
  type: ResourceType
  category: string
  description: string
  content: string
  thumbnail?: string
  duration?: string
  date: string
  readTime?: string
}
export const resources: Resource[] = [
  {
    id: 1,
    title: "Horace Demo",
    type: "video",
    category: "Demo",
    description:
      "Complete walkthrough of the Horace platform features and capabilities",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
    content: "https://femi.b-cdn.net/horace-demo.mp4",
    duration: "12:34",
    date: "2024-07-15",
  },
  {
    id: 2,
    title: "Product Release v1.9 Documentation",
    type: "document",
    category: "Documentation",
    description:
      "Comprehensive documentation for the latest Horace release including new features and improvements",
    content: "https://docs.horace.com/release-v1.9.pdf",
    date: "2024-07-10",
  },
  {
    id: 3,
    title: "Summer Camp",
    type: "document",
    category: "Campaign",
    description: "Horace summer camp bootcamp",
    content: "https://femi.b-cdn.net/summer%20camp.pdf",
    readTime: "1 min read",
    date: "2024-07-08",
  },
  {
    id: 4,
    title: "API Integration Guide",
    type: "document",
    category: "Documentation",
    description:
      "Complete guide for integrating Horace APIs into your applications",
    content: "https://lms.horacelearning.com/dashboard/api-docs",
    date: "2024-07-05",
  },
  {
    id: 5,
    title: "Student Assessment System",
    type: "document",
    category: "Documentation",
    description:
      "the student assessment and grading system for Horace platform",
    content:
      "https://femi.b-cdn.net/Student%20Assessment%20System%20Documentation.pdf",
    readTime: "3 min read",
    date: "2024-07-01",
  },
]

const categories = [
  "all",
  "Demo",
  "Campaign",
  "Documentation",
  "Tutorial",
  "Blog",
  "Security",
  "Case Study",
]

const HoraceResourcesPage = () => {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const router = useRouter()

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getIcon = (type: ResourceType) => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5" />
      case "document":
        return <FileText className="w-5 h-5" />
      case "blog":
      case "article":
        return <BookOpen className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: ResourceType) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-800"
      case "document":
        return "bg-blue-100 text-blue-800"
      case "blog":
        return "bg-green-100 text-green-800"
      case "article":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleResourceClick = (resource: Resource) => {
    const routeType = resource.type === "blog" ? "article" : resource.type
    router.push(`/dashboard/resources/${routeType}/${resource.id}`)
  }
  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Access Denied</h1>
        <br />
        <Link href="/login" className="text-blue-600 hover:text-blue-700">
          Click here to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Horace Resources
            </h1>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Thumbnail */}
              {resource.type === "video" && resource.thumbnail && (
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleResourceClick(resource)}
                >
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    width={500}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg hover:bg-opacity-30 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
                      <Play className="w-8 h-8 text-gray-800" />
                    </div>
                  </div>
                  {resource.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {resource.duration}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                {/* Resource Type and Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(resource.type)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}
                    >
                      {resource.type.charAt(0).toUpperCase() +
                        resource.type.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {resource.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(resource.date).toLocaleDateString()}
                  </div>
                  {resource.readTime && <span>{resource.readTime}</span>}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResourceClick(resource)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {resource.type === "video"
                      ? "Watch"
                      : resource.type === "document"
                        ? "View"
                        : "Read"}
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  {resource.type === "document" && (
                    <a
                      href={resource.content}
                      download
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                      title="Download document"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter to find what
              you are looking for.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action Footer */}
      <div className="bg-blue-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can not find what you are looking for?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Reach out to us for personalized
            assistance or to request specific resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Request Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HoraceResourcesPage
