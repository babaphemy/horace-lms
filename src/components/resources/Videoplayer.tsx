import { Resource } from "@/types/types"
import { Calendar } from "lucide-react"
import ReactPlayer from "react-player"

const VideoPlayer = ({ resource }: { resource: Resource }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video bg-black">
        <ReactPlayer
          url={resource.content}
          width="100%"
          height="100%"
          controls
          playing={false}
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
        />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {resource.title}
        </h1>
        <p className="text-gray-600 mb-4">{resource.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(resource.date).toLocaleDateString()}
          </span>
          {resource.duration && <span>Duration: {resource.duration}</span>}
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
            {resource.category}
          </span>
        </div>
      </div>
    </div>
  )
}
export default VideoPlayer
