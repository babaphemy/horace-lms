"use client"
import React, { createContext, ReactElement, useReducer } from "react"
import { tCourse, tCourseLte, tLecture } from "@/types/types"
import { Action, MODAL_SET, USER_ADD, USER_RESET } from "./Action"
import { COURSE_SET, COURSES_SET, SET_PLAY_ID } from "./actions"

type State = {
  user: any
  course: tCourse | null
  courses: tCourseLte[] | []
  playId: tLecture | null
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
  course: null,
  courses: [],
  playId: null,
  modal: {
    open: false,
    type: "login",
  },
}

const Appcontext = createContext(initialState)
const AppDpx = createContext<React.Dispatch<Action>>(() => {})
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
