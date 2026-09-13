import { Feature } from "../../../types/types"

interface FeatureCardProps {
  feature: Feature
}

const colors = [
  "#F9AD56",
  "#16C79A",
  "#FF5E78",
  "#5D5FEF",
  "#0F5E76",
  "#6AB04A",
  "#8E44AD",
  "#3498DB",
]

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon
  const color =
    colors[
      feature.title
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length
    ]
  return (
    <div
      className="mx-auto sm:mx-0 space-y-2 rounded overflow-hidden shadow-sm bg-white p-6 border min-h-[260px]"
      style={{ borderColor: color }}
    >
      <div
        className="flex items-center justify-center p-4 w-fit mb-5 rounded"
        style={{ backgroundColor: color }}
      >
        <Icon sx={{ color: "white" }} />
      </div>
      <div className="font-bold text-xl mb-2 text-gray-700">
        {feature.title}
      </div>
      <p className="text-gray-700 text-base">{feature.description}</p>
    </div>
  )
}
export default FeatureCard
