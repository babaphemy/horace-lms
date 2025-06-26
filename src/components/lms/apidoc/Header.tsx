import { Menu, Search, X } from "lucide-react"

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
}: {
  sidebarOpen: boolean
  setSidebarOpen: (_open: boolean) => void
  searchTerm: string
  setSearchTerm: (_term: string) => void
}) => {
  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#1e293b",
          }}
        >
          <div style={{ fontSize: "24px" }}>🚀</div>
          <span>Horace LMS API</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                zIndex: 1,
              }}
              size={16}
            />
            <input
              type="text"
              placeholder="Search documentation... (⌘K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px 16px 10px 40px",
                border: "1px solid #e2e8f0",
                borderRadius: "25px",
                fontSize: "14px",
                width: "320px",
                outline: "none",
                background: "rgba(248, 250, 252, 0.9)",
              }}
            />
          </div>

          <button
            style={{
              display: isMobile ? "block" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "8px",
              color: "#64748b",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
export default Header
