import { SET_USER } from "@/context/actions"
import { AppDpx } from "@/context/Appcontext"
import { getAllUsers, getUserById } from "@/rest/api"
import { AccessRoleEnum, GenderEnum, UserResponse } from "@/types/api"
import { useQuery } from "@tanstack/react-query"
import { signOut, useSession } from "next-auth/react"
import { useContext } from "react"

const useUser = () => {
  const dispatch = useContext(AppDpx)
  const { data: session } = useSession()

  const setUser = () => {
    if (session?.user) {
      const roles = session?.user?.roles?.map(
        (role: string) => role as AccessRoleEnum
      )
      const user: UserResponse = {
        roles: roles || ["GUEST"],
        id: session.user.id,
        email: session.user.email,
        first_name: session?.user?.first_name || "",
        last_name: session?.user?.name || "",
        gender: GenderEnum.MALE,
      }
      dispatch({ type: SET_USER, payload: user })
    }
  }

  const removeUser = () => {
    dispatch({ type: SET_USER, payload: null })
    signOut({ redirect: false })
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    setUser,
    removeUser,
  }
}

export default useUser

export const useGetUsers = () => {
  const {
    data: allUsers,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
    initialData: [],
  })

  return { allUsers, error, isLoading }
}

export const useGetUserById = (userId: number) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user-by-id", userId],
    queryFn: () => getUserById(userId),
    initialData: null,
    enabled: !!userId,
  })

  return { user, error, isLoading }
}
