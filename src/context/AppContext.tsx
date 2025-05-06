"use client"
import React, { createContext, ReactElement, useReducer } from "react"
import {
  Plan,
  TCountryCode,
  tCourse,
  tCourseLte,
  tLecture,
  Tranx,
  UserDto,
} from "@/types/types"
import {
  Action,
  MODAL_SET,
  SET_LOCALE,
  SET_PAYMENT_STATUS,
  SET_PLAN,
  SET_STEP,
  SET_TRANX,
  SET_USER,
  SET_USER_ID,
  USER_ADD,
  USER_RESET,
} from "./Action"
import { COURSE_SET, COURSES_SET, SET_PLAY_ID } from "./actions"

type State = {
  user: UserDto | null
  paymentStatus: string
  userId: string | null
  course: tCourse | null
  courses: tCourseLte[] | []
  playId: tLecture | null
  plan: Plan | null
  step: number
  locale: TCountryCode
  isAuthenticated: boolean
  tranx: Tranx | null

  modal: {
    open: boolean
    type: "login" | "signup" | "payment" | "review" | "forgotPassword"
  }
}

type Props = {
  children: ReactElement
}

const getuser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("horaceUser")
    if (user) {
      return JSON.parse(user)
    }
    return null
  }
  return
}

const initialState: State = {
  user: getuser(),
  userId: null,
  paymentStatus: "initial",
  course: null,
  courses: [],
  plan: null,
  playId: null,
  step: 0,
  locale: "US",
  tranx: null,
  isAuthenticated: false,
  modal: {
    open: false,
    type: "login",
  },
}

const Appcontext = createContext(initialState)
const AppDpx = createContext<React.Dispatch<Action>>(() => {})
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data,
        isAuthenticated: true,
      }
    case SET_PAYMENT_STATUS:
      return {
        ...state,
        paymentStatus: action.payload,
      }

    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload,
      }
    case USER_ADD:
      return {
        ...state,
        user: action.payload,
      }
    case USER_RESET:
      return {
        ...state,
        user: null,
      }
    case SET_STEP:
      return {
        ...state,
        step: action.payload,
      }
    case COURSE_SET:
      return {
        ...state,
        course: action.data,
      }
    case COURSES_SET:
      return {
        ...state,
        courses: action.data,
      }
    case SET_PLAY_ID:
      return {
        ...state,
        playId: action.data,
      }
    case SET_PLAN:
      return {
        ...state,
        plan: action.payload,
      }
    case SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
      }
    case SET_TRANX:
      return {
        ...state,
        tranx: action.payload,
      }
    case MODAL_SET:
      return {
        ...state,
        modal: {
          open: action.data.open,
          type: action.data.type,
        },
      }
    default:
      return state
  }
}

const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Appcontext.Provider value={state}>
      <AppDpx.Provider value={dispatch}>{children}</AppDpx.Provider>
    </Appcontext.Provider>
  )
}

export { Appcontext, AppDpx, AppProvider }
