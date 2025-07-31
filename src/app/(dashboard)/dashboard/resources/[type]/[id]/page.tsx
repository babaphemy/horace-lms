"use client"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Resource, resources } from "../../page"
import { Home, ChevronRight, FileText } from "lucide-react"
import VideoPlayer from "@/components/resources/Videoplayer"
import PDFViewer from "@/components/resources/PDFViewer"
import ArticleViewer from "@/components/resources/ArticleViewer"

const Breadcrumb = ({ resource }: { resource: Resource }) => {
  const router = useRouter()

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <button
        onClick={() => router.push("/dashboard/resources")}
        className="hover:text-blue-600 transition-colors"
      >
        Resources
      </button>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <span className="text-gray-900 font-medium">{resource.title}</span>
    </nav>
  )
}

const ResourcePage = () => {
  const { type, id } = useParams<{ type: string; id: string }>()
  const resource = resources.find(
    (res) => res.id === parseInt(id, 10) && res.type === type
  )

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Resource Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The resource you are looking for does not exist or may have been
              moved.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderResourceViewer = () => {
    switch (resource.type) {
      case "video":
        return <VideoPlayer resource={resource} />
      case "document":
        return <PDFViewer resource={resource} />
      case "article":
      case "blog":
        return <ArticleViewer resource={resource} />
      default:
        return <ArticleViewer resource={resource} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb resource={resource} />
        {renderResourceViewer()}
      </div>
    </div>
  )
}

export default ResourcePage
