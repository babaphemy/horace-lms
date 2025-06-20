import { styled } from "@mui/material/styles"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { memo, useEffect, useState } from "react"
import styles from "./SubMenu.module.css"

export interface TSubNav {
  active: boolean
  allowed_roles: string[]
  order: number
  path: string
  title: string
}

export interface TNavBar {
  active: boolean
  allowed_roles: string[]
  icon: JSX.Element
  id: number
  iconClosed?: JSX.Element
  iconOpened?: JSX.Element
  order: number
  path: string
  title: string
  sub_nav?: TSubNav[]
}

const SidebarLabel = styled("span")(() => ({
  position: "relative",
  top: "-3px",
}))

const SubMenuComponent = ({ item }: { item: TNavBar }) => {
  const [subnav, setSubnav] = useState(false)
  const showSubnav = () => setSubnav(!subnav)
  const [currentPath, setCurrentPath] = useState("")
  const theCurrentPath = usePathname()

  useEffect(() => {
    setCurrentPath(theCurrentPath)
  }, [theCurrentPath])

  const renderIcon = (icon: JSX.Element | string | null) => {
    if (!icon) return null

    if (typeof icon === "string") {
      return <span className="icon-text">{icon}</span>
    }
    return icon
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    if (item.sub_nav) {
      e.preventDefault()
      showSubnav()
    }
  }

  const goToDoc = () => {
    window.open("/apidocs")
  }

  return (
    <>
      <Link
        href={item.path}
        onClick={item.path === "/apidocs" ? goToDoc : handleLinkClick}
        className={`${styles.sidebarLink} ${
          currentPath === item.path ? styles.sidebarLinkActive : ""
        }`}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderIcon(item.icon)}
          <SidebarLabel className="ml-1">{item.title}</SidebarLabel>
        </div>
        <div>
          {item.sub_nav && subnav
            ? item.iconOpened
            : item.sub_nav
              ? item.iconClosed
              : null}
        </div>
      </Link>
      {subnav &&
        item.sub_nav?.map((subItem, index) => {
          return (
            <Link
              href={subItem.path}
              key={index}
              className={`${styles.sidebarLink2} ${
                currentPath === subItem.path ? styles.sidebarLinkActive2 : ""
              }`}
            >
              {subItem.title}
            </Link>
          )
        })}
    </>
  )
}

SubMenuComponent.displayName = "SubMenu"

const SubMenu = memo(SubMenuComponent)

export default SubMenu
