import { AlertProps } from "@/types/types"
import { LMStypes } from "./content"
import { Info } from "lucide-react"

const Alert = ({ children, type = "info", icon: Icon = Info }: AlertProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        borderRadius: "10px",
        margin: "20px 0",
        borderLeft: `4px solid ${LMStypes[type].borderColor}`,
        ...LMStypes[type],
      }}
    >
      <Icon size={20} />
      <div>{children}</div>
    </div>
  )
}
export default Alert
