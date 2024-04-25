import React, { createContext, ReactElement } from "react"
import { Action, tCourse, tLecture, tUser } from "../types/types"
import { COURSES_SET } from "./actions"
interface State {
  loading: boolean
  user?: tUser | null
  courses: [tCourse] | []
  course: tCourse | null
  lecture: tLecture | null
}
interface Props {
  children: ReactElement
}
const appState: State = {
  loading: false,
  user: null,
  course: null,
  lecture: null,
  courses: [],
}
const AppContext = createContext(appState)
const AppDpx = createContext<React.Dispatch<Action>>(() => {})
const AppProvider = ({ children }: Props) => {
  const [state, dispatch] = React.useReducer(
    (state: State = appState, action: Action): State => {
      switch (action.type) {
        case COURSES_SET:
          return { ...state, courses: action.data }

        default:
          return state
      }
    },
    appState
  )
  return (
    <AppContext.Provider value={state}>
      <AppDpx.Provider value={dispatch}>{children}</AppDpx.Provider>
    </AppContext.Provider>
  )
}
export { AppProvider, AppContext, AppDpx }
