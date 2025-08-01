import { Resource } from "@/types/types"
import { Calendar, Download, FileText } from "lucide-react"

const PDFViewer = ({ resource }: { resource: Resource }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PDF Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h1 className="text-xl font-bold text-gray-900">
              {resource?.title}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {resource?.description}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {resource?.date &&
                    new Date(resource.date).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {resource?.category}
                </span>
              </div>

              <div className="ml-auto">
                <a
                  href={resource?.content}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="h-96 md:h-screen max-h-screen bg-gray-100">
            {resource?.content ? (
              <iframe
                src={`${resource.content}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={resource.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-70" />
                  <p className="text-lg">PDF Viewer</p>
                  <p className="text-sm opacity-70">
                    Document would be displayed here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default PDFViewer
