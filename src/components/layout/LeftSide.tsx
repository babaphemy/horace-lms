import { Book, GridView, Settings } from "@mui/icons-material"
import ClearIcon from "@mui/icons-material/Clear"
import { Box } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { styled } from "@mui/material/styles"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import SubMenu, { TNavBar } from "./SubMenu"

const SidebarNav = styled("nav")(() => ({
  background: "#fff",
  boxShadow: "0px 4px 20px rgba(47, 143, 232, 0.07)",
  width: "300px",
  padding: "30px 10px",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  top: 0,
  left: 0,
  transition: "350ms",
  zIndex: "10",
  overflowY: "auto",
}))

const SidebarWrap = styled("div")(() => ({
  width: "100%",
}))
interface SidebarProps {
  toogleActive: () => void
}

const LeftSide: React.FC<SidebarProps> = ({ toogleActive }) => {
  return (
    <Box className="leftSidebarDark">
      <SidebarNav className="LeftSidebarNav">
        <SidebarWrap>
          <Box
            sx={{
              mb: "20px",
              px: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/">
              <Image
                src="/img/logo.webp"
                alt="Logo"
                className="black-logo"
                width={150}
                height={50}
              />
            </Link>

            <IconButton
              onClick={toogleActive}
              size="small"
              sx={{
                background: "rgb(253, 237, 237)",
                display: { lg: "none" },
              }}
              data-cy="toggle-off"
            >
              <ClearIcon />
            </IconButton>
          </Box>
          {menuData.map((item, index: number) => {
            return <SubMenu item={item} key={index} />
          })}
        </SidebarWrap>
      </SidebarNav>
    </Box>
  )
}

export default LeftSide

const menuData: TNavBar[] = [
  {
    id: 1,
    title: "Dashboard",
    allowed_roles: ["User"],
    icon: <GridView />,
    active: true,
    order: 0,
    sub_nav: [],
    path: "/dashboard",
  },
  {
    id: 2,
    title: "Courses",
    allowed_roles: ["Instructor"],
    icon: <Book />,
    active: true,
    order: 1,
    sub_nav: [
      {
        title: "Add",
        path: "/dashboard/courses/add",
        allowed_roles: ["Admin"],
        active: true,
        order: 0,
      },
      {
        title: "My Courses",
        path: "/dashboard/courses",
        allowed_roles: ["Admin"],
        active: true,
        order: 1,
      },
    ],
    path: "#",
  },
  {
    id: 3,
    title: "Settings",
    path: "#",
    icon: <Settings />,
    allowed_roles: ["Admin"],
    active: true,
    order: 2,
    sub_nav: [
      {
        title: "Account",
        path: "/settings/account/",
        allowed_roles: ["Admin"],
        active: true,
        order: 0,
      },
      {
        title: "Security",
        path: "/settings/security/",
        allowed_roles: ["Admin"],
        active: true,
        order: 1,
      },
      {
        title: "Privacy Policy",
        path: "/dashboard/settings/privacy-policy/",
        allowed_roles: ["Admin"],
        active: true,
        order: 2,
      },
      {
        title: "Organization",
        path: "/dashboard/settings/org/",
        allowed_roles: ["Admin"],
        active: true,
        order: 3,
      },
      {
        title: "Logout",
        path: "/authentication/logout/",
        allowed_roles: ["Admin"],
        active: true,
        order: 4,
      },
    ],
  },
]
