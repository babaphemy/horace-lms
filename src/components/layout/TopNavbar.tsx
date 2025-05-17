import * as React from "react"
import { AppBar, Toolbar, IconButton, Stack, Typography } from "@mui/material"
import Tooltip from "@mui/material/Tooltip"
import Notification from "./Notification"
import Profile from "../user/Profile"
import CurrentDate from "./CurrentDate"
import SearchForm from "./SearchForm"
interface Props {
  toogleActive: () => void
}
const TopNavbar: React.FC<Props> = ({ toogleActive }) => {
  return (
    <>
      <div className="topNavbarDark">
        <AppBar
          color="inherit"
          sx={{
            backgroundColor: "#fff",
            boxShadow: "0px 4px 20px rgba(47, 143, 232, 0.07)",
            py: "6px",
            mb: "30px",
            position: "sticky",
          }}
          className="top-navbar-for-dark"
        >
          <Toolbar>
            <Tooltip title="Hide/Show" arrow>
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                onClick={toogleActive}
                data-cy="toggle"
              >
                <i className="ri-align-left"></i>
              </IconButton>
            </Tooltip>

            <SearchForm />

            <Typography component="div" sx={{ flexGrow: 1 }}></Typography>

            <Stack direction="row" spacing={2}>
              <CurrentDate />

              <Notification />

              <Profile />
            </Stack>
          </Toolbar>
        </AppBar>
      </div>
    </>
  )
}

export default TopNavbar
