import { ApiEndpointProps, BadgeProps } from "@/types/types"
import Badge from "./Badge"
import Parameter from "./Parameter"

const ApiEndpoint = ({
  method,
  path,
  description,
  children,
  parameters,
}: ApiEndpointProps) => (
  <div
    style={{
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      margin: "24px 0",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        background: "#f8fafc",
        padding: "20px",
        borderBottom: "1px solid #e2e8f0",
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
        <Badge variant={method.toLowerCase() as BadgeProps["variant"]}>
          {method}
        </Badge>
        <code
          style={{
            fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
            background: "#1e293b",
            color: "#e2e8f0",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        >
          {path}
        </code>
      </div>
      <p style={{ color: "#64748b", margin: "0", fontSize: "14px" }}>
        {description}
      </p>
    </div>

    {parameters && parameters.length > 0 && (
      <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0" }}>
        <h4
          style={{ margin: "0 0 16px 0", color: "#1e293b", fontSize: "16px" }}
        >
          Parameters
        </h4>
        {parameters.map((param, index) => (
          <Parameter key={index} {...param} />
        ))}
      </div>
    )}
    <div style={{ padding: "20px" }}>{children}</div>
  </div>
)
export default ApiEndpoint
