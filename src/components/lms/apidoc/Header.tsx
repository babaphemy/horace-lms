import { useIsMobile } from "@/hooks/useMobile"
import { Menu, Search, X } from "lucide-react"
import Link from "next/link"
import styles from "./Header.module.css"

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
  const isMobile = useIsMobile(768)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>🚀</div>
          <span>Horace LMS API</span>
        </Link>

        <div className={styles.actions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={16} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search documentation... (⌘K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: isMobile ? "block" : "none" }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
