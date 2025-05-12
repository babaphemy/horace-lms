import {
  Assessment,
  CalendarMonth,
  Book,
  Chat,
  Check,
  CreditCard,
  Dashboard,
  Email,
  Event,
  Group,
  Lock,
  Money,
  MoneySharp,
  Person,
  School,
  Subject,
} from "@mui/icons-material"
import GridViewIcon from "@mui/icons-material/GridView"
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded"
import AssessmentIcon from "@mui/icons-material/Assessment"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import SettingsIcon from "@mui/icons-material/Settings"
import { OverridableComponent } from "@mui/material/OverridableComponent"
import { SvgIconTypeMap } from "@mui/material"

export interface IconMapping {
  [key: string]: OverridableComponent<SvgIconTypeMap<object, "svg">>
}

export const iconMapping: IconMapping = {
  Assessment,
  AssessmentIcon,
  Book,
  BookmarkAddedIcon,
  CalendarMonth,
  Chat,
  Check,
  CreditCard,
  Dashboard,
  Email,
  Event,
  GridViewIcon,
  Group,
  KeyboardArrowDownIcon,
  KeyboardArrowRightIcon,
  Lock,
  MailOutlineIcon,
  Money,
  MoneySharp,
  NotificationsNoneIcon,
  Person,
  School,
  SettingsIcon,
  Subject,
}
