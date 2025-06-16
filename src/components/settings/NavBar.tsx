import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./NavBar.module.css"

const NavBar = () => {
  const pathname = usePathname()

  return (
    <>
      <nav className={styles.topNavStyle}>
        <ul>
          <li className={pathname.includes("account") ? styles.active : ""}>
            <Link href="/settings/account">Organization</Link>
          </li>
          <li className={pathname.includes("security") ? styles.active : ""}>
            <Link href="/settings/security">Change Password</Link>
          </li>
          <li
            className={pathname.includes("privacy-policy") ? styles.active : ""}
          >
            <Link href="/settings/privacy-policy">Privacy Policy</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default NavBar
