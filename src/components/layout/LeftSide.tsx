import React, { useMemo } from "react"
import { Box } from "@mui/material"
import { styled } from "@mui/material/styles"
import Link from "next/link"
import ClearIcon from "@mui/icons-material/Clear"
import IconButton from "@mui/material/IconButton"
import { useSession } from "next-auth/react"
import Image from "next/image"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { iconMapping } from "./SidebarData"
import SubMenu, { TIcon, TNavBar } from "./SubMenu"
import { useGetSideBarData } from "@/hooks/useGetSideBarData"

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
  const { data: session } = useSession()

  const { navData }: { navData: TNavBar<TIcon>[] } = useGetSideBarData(
    session?.user?.roles[0] ?? "Guest"
  )

  const menuData = useMemo(() => {
    if (navData.length > 0) {
      return navData?.map((item) => {
        //> filter out nav items that are not allowed for the current user role
        const subNavs =
          item?.sub_nav?.filter((nav) =>
            nav?.allowed_roles.includes(session?.user?.roles[0] ?? "Guest")
          ) || []

        if (subNavs.length > 0) {
          const IconComponent = item?.icon?.name
            ? iconMapping[item.icon.name]
            : null
          return {
            ...item,
            sub_nav: subNavs,
            iconClosed: <KeyboardArrowRightIcon />,
            iconOpened: <KeyboardArrowDownIcon />,
            icon: IconComponent ? <IconComponent /> : null,
          }
        } else {
          const IconComponent = item.icon ? iconMapping[item.icon.name] : null
          return {
            ...item,
            icon: IconComponent ? <IconComponent /> : null,
          }
        }
      })
    } else return []
  }, [navData, session?.user?.roles])

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
                src="/images/logo.webp"
                alt="Logo"
                className="black-logo"
                width={150}
                height={50}
              />

              <Image
                src="/images/logo-white.png"
                alt="Logo"
                className="white-logo"
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
