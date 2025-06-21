import { ParameterProps } from "@/types/types"
import Badge from "./Badge"

const Parameter = ({
  name,
  type,
  required = false,
  description,
  children,
}: ParameterProps) => (
  <div
    style={{
      marginBottom: "16px",
      padding: "16px",
      background: "#f8fafc",
      borderRadius: "8px",
      borderLeft: "4px solid #64748b",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "8px",
        flexWrap: "wrap",
      }}
    >
      <code
        style={{
          fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
          fontSize: "14px",
          fontWeight: "600",
          color: "#1e293b",
        }}
      >
        {name}
      </code>
      <Badge variant="info">{type}</Badge>
      {required ? (
        <Badge variant="error">Required</Badge>
      ) : (
        <Badge variant="success">Optional</Badge>
      )}
    </div>

    {description && (
      <p style={{ color: "#64748b", margin: "8px 0 0 0", fontSize: "14px" }}>
        {description}
      </p>
    )}

    {children}
  </div>
)

export default Parameter
