import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import {
  Badge,
  Button,
  IconButton,
  Link,
  Menu,
  Tooltip,
  Typography,
} from "@mui/material"
import * as React from "react"
import styles from "./Notification.module.css"

interface Notification {
  id: string
  created_at: string
  recipient_type: string
  message: string
  content?: {
    message: string
  }
}

const Notification = () => {
  // const { data: session } = useSession();
  // const user = session?.user;
  // const userId = user?.id;
  const [schoolNotifications] = React.useState<Notification[]>([])
  const [classNotifications] = React.useState<Notification[]>([])

  // React.useEffect(() => {
  //   if (!userId) return;
  //   const eventSource = new EventSource(
  //     `${basePath}messaging/notifications/sse/${userId}`
  //   );

  //   eventSource.addEventListener(
  //     'new_school_notifications_notification',
  //     (event: MessageEvent) => {
  //       const newNotification: Notification = JSON.parse(event.data);
  //       setSchoolNotifications(prev => [...prev, newNotification]);
  //     }
  //   );

  //   eventSource.addEventListener(
  //     'new_user_notifications_notification',
  //     (event: MessageEvent) => {
  //       const newNotification: Notification = JSON.parse(event.data);
  //       setClassNotifications(prev => [...prev, newNotification]);
  //     }
  //   );

  //   return () => {
  //     eventSource.close();
  //   };
  // }, [userId]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Notification">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            backgroundColor: "#f5f5f5",
            width: "40px",
            height: "40px",
            p: 0,
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="ml-2 for-dark-notification"
        >
          <Badge color="secondary" variant="dot">
            <NotificationsActiveIcon color="action" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          sx: {
            padding: "5px 20px 5px",
            borderRadius: "10px",
            boxShadow: "0px 10px 35px rgba(50, 110, 189, 0.2)",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className={styles.header}>
          <Typography variant="h4">
            Notifications (
            {schoolNotifications.length + classNotifications.length})
          </Typography>
          <Button variant="text">clear all</Button>
        </div>
        <div className={styles.notification}>
          {schoolNotifications?.length > 0 && (
            <div className={styles.notificationList}>
              {schoolNotifications.map((notification) => (
                <div key={notification.created_at}>
                  <Typography
                    key={notification.id}
                    variant="h5"
                    sx={{
                      fontSize: "14px",
                      color: "#260944",
                      fontWeight: "500",
                      mb: 1,
                    }}
                  >
                    {notification?.recipient_type?.replace(/_/g, " ")}
                  </Typography>
                  <div className={styles.notificationListContent}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "13px",
                        color: "#5B5B98",
                        fontWeight: "500",
                      }}
                      className="ml-1"
                    >
                      {notification?.message || "No Message"}
                    </Typography>
                  </div>
                  <Typography
                    sx={{ fontSize: "12px", color: "#A9A9C8", mt: 1 }}
                  >
                    {notification?.created_at || new Date().toLocaleString()}
                  </Typography>
                </div>
              ))}
            </div>
          )}
          {classNotifications?.length > 0 && (
            <div className={styles.notificationList}>
              {classNotifications.map((notification) => (
                <div key={notification.created_at}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "14px",
                      color: "#260944",
                      fontWeight: "500",
                      mb: 1,
                    }}
                  >
                    {notification?.recipient_type?.replace(/_/g, " ")}
                  </Typography>

                  <div className={styles.notificationListContent}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "13px",
                        color: "#5B5B98",
                        fontWeight: "500",
                      }}
                      className="ml-1"
                    >
                      {notification?.content?.message || "No Message"}
                    </Typography>
                  </div>

                  <Typography
                    sx={{ fontSize: "12px", color: "#A9A9C8", mt: 1 }}
                  >
                    {notification?.created_at || new Date().toLocaleString()}
                  </Typography>
                </div>
              ))}
            </div>
          )}

          <Typography component="div" textAlign="center">
            <Link
              href="/notification/"
              underline="none"
              sx={{
                fontSize: "13px",
                color: "#757FEF",
                fontWeight: "500",
                mt: "10px",
                display: "inline-block",
              }}
            >
              View All{" "}
              <span className={styles.rightArrow}>
                <i className="ri-arrow-right-s-line"></i>
              </span>
            </Link>
          </Typography>
        </div>
      </Menu>
    </>
  )
}

export default Notification
