import { Feature } from "../../../types/types"

interface FeatureCardProps {
  feature: Feature
}
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon = feature.icon
  const colors = [
    "#F9AD56", // Orange
    "#16C79A", // Turquoise
    "#FF5E78", // Pink
    "#5D5FEF", // Blue
    "#FF6B6B", // Red
    "#6AB04A", // Green
    "#8E44AD", // Purple
    "#3498DB", // Sky blue
    "#F39C12", // Yellow
  ]

  function getRandomColor(colorsArray: string[]) {
    const randomIndex = Math.floor(Math.random() * colorsArray.length)
    return colorsArray[randomIndex]
  }

  const color = getRandomColor(colors)
  return (
    <div
      className="max-w-sm  mx-auto sm:mx-0 space-y-2 rounded overflow-hidden shadow-lg bg-white p-6 border-2 min-h-[300px]"
      style={{ borderColor: color }}
    >
      <div
        className={`flex items-center justify-center p-4 w-fit mb-5 rounded-full`}
        style={{ backgroundColor: color }}
      >
        <Icon />
      </div>
      <div className="font-bold text-xl mb-2 text-gray-700">
        {feature.title}
      </div>
      <p className="text-gray-700 text-base">{feature.description}</p>
    </div>
  )
}
export default FeatureCard
