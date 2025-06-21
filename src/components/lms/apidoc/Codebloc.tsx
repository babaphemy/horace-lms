import { CodeBlockProps } from "@/types/types"
import { Check, Copy } from "lucide-react"

const CodeBlock = ({
  children,
  title,
  copyText,
  copiedCode = "",
  copyToClipboard,
}: CodeBlockProps) => (
  <div
    style={{
      background: "#1e293b",
      borderRadius: "12px",
      overflow: "hidden",
      margin: "20px 0",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      maxHeight: "400px",
      overflowY: "scroll",
    }}
    className="no-scrollbar"
  >
    {title && (
      <div
        style={{
          background: "#334155",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
        }}
      >
        <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "500" }}>
          {title}
        </span>
        {copyText && (
          <button
            style={{
              background: "rgba(102, 126, 234, 0.2)",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              color: "#667eea",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => copyToClipboard(copyText, `code-${title}`)}
          >
            {copiedCode === `code-${title}` ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        )}
      </div>
    )}
    <pre
      style={{
        padding: "20px",
        margin: "0",
        overflowX: "auto",
        background: "transparent",
      }}
    >
      <code
        style={{
          color: "#e2e8f0",
          fontFamily: "Monaco, Menlo, Ubuntu Mono, monospace",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {children}
      </code>
    </pre>
  </div>
)
export default CodeBlock
