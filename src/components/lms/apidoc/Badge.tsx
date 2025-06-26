import { BadgeProps } from "@/types/types"
import { badgeVariant } from "./content"

const Badge = ({ children, variant = "default" }: BadgeProps) => {
  const variants = badgeVariant

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        ...variants[variant],
      }}
    >
      {children}
    </span>
  )
}
export default Badge
