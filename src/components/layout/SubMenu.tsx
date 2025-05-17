import { styled } from "@mui/material/styles"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React, { memo, useEffect, useState } from "react"
import styles from "./SubMenu.module.css"

export interface TIcon {
  type: string
  name: string
  path: string
}
export interface TSubNav {
  active: boolean
  allowed_roles: string[]
  order: number
  path: string
  title: string
}
export interface TNavBar<T> {
  active: boolean
  allowed_roles: string[]
  created_at: string
  updated_at: string
  icon: T | null
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

const SubMenuComponent = ({ item }: { item: TNavBar<React.JSX.Element> }) => {
  const [subnav, setSubnav] = useState(false)
  const showSubnav = () => setSubnav(!subnav)
  const [currentPath, setCurrentPath] = useState("")
  const theCurrentPath = usePathname()

  useEffect(() => {
    setCurrentPath(theCurrentPath)
  }, [theCurrentPath])

  return (
    <>
      <Link
        href={item.path}
        onClick={item.sub_nav && showSubnav}
        className={`${styles.sidebarLink} ${
          currentPath == item.path && "sidebarLinkActive"
        }`}
      >
        <div>
          {item.icon}
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
        item.sub_nav?.map((item, index) => {
          return (
            <Link
              href={item.path}
              key={index}
              className={`${styles.sidebarLink2} ${
                currentPath == item.path && "sidebarLinkActive2"
              }`}
            >
              {item.title}
            </Link>
          )
        })}
    </>
  )
}

SubMenuComponent.displayName = "SubMenu"

const SubMenu = memo(SubMenuComponent)

export default SubMenu
