import { Resource } from "@/types/types"
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

const ArticleViewer = ({ resource }: { resource: Resource }) => {
  const articleContent = `
    <h2>Introduction</h2>
    <p>This is where the article content would be displayed. In a real implementation, you would fetch the content from the URL and render it here.</p>
    
    <h3>Key Points</h3>
    <ul>
      <li>Point 1: Important information</li>
      <li>Point 2: More details</li>
      <li>Point 3: Additional insights</li>
    </ul>
    
    <h3>Conclusion</h3>
    <p>Summary of the article content...</p>
  `

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/resources"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resources
        </Link>

        {/* Article Section */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {resource?.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {resource?.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {resource?.date &&
                    new Date(resource.date).toLocaleDateString()}
                </span>
                {resource?.readTime && <span>{resource.readTime}</span>}
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {resource?.category}
                </span>
                <a
                  href={resource?.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-auto"
                >
                  View Original
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </header>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}
export default ArticleViewer
