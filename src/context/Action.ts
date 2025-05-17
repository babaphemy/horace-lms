import {
  Plan,
  TCountryCode,
  tCourse,
  tCourseLte,
  tLecture,
  Tranx,
  UserDto,
} from "../types/types"

export type Action =
  | {
      type: "SET_USER"
      data: UserDto | null
    }
  | { type: "SET_STEP"; payload: number }
  | {
      type: "USER_ADD"
      payload: UserDto
    }
  | {
      type: "USER_RESET"
      payload: null
    }
  | {
      type: "MODAL_SET"
      data: {
        open: boolean
        type: "login" | "signup" | "payment" | "review" | "forgotPassword"
      }
    }
  | { type: "LECTURE_SET"; data: tLecture }
  | { type: "COURSE_SET"; data: tCourse }
  | { type: "COURSES_SET"; data: tCourseLte[] }
  | { type: "SET_PLAY_ID"; data: tLecture }
  | { type: "SET_PLAN"; payload: Plan | null }
  | { type: "SET_TRANX"; payload: Tranx | null }
  | { type: "SET_LOCALE"; payload: TCountryCode }
  | { type: "SET_USER_ID"; payload: string }
  | { type: "SET_PAYMENT_STATUS"; payload: string }

export const USER_ADD = "USER_ADD"
export const USER_RESET = "USER_RESET"
export const MODAL_SET = "MODAL_SET"
export const SET_PLAN = "SET_PLAN"
export const SET_TRANX = "SET_TRANX"
export const SET_LOCALE = "SET_LOCALE"
export const SET_USER = "SET_USER"
export const SET_USER_ID = "SET_USER_ID"
export const SET_STEP = "SET_STEP"
export const SET_PAYMENT_STATUS = "SET_PAYMENT_STATUS"
