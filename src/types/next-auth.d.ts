import {
  Account as DefaultAccount,
  DefaultSession,
  DefaultUser,
} from "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  export interface Session {
    user: {
      id: string
      name?: string | null
      firstname?: string | null
      lastname?: string | null
      email?: string | null
      image?: string | null
      phone?: string
      password?: string
      roles: string[]
      token?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  export interface User extends DefaultUser {
    id: string
    firstname?: string | null
    lastname?: string | null
    phone?: string
    password?: string
    roles: string[]
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    id?: string
    roles?: string[]
    user?: {
      id: string
      name?: string | null
      firstname?: string | null
      lastname?: string | null
      email?: string | null
      image?: string | null
      phone?: string
      password?: string
      roles: string[]
      token?: string
    }
  }
}

declare module "next-auth" {
  interface Account extends DefaultAccount {
    userData?: {
      id: string
      name?: string | null
      firstname?: string | null
      lastname?: string | null
      email?: string | null
      image?: string | null
      phone?: string
      password?: string
      roles: string[]
      token?: string
    }
  }
}
