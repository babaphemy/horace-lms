import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { auth, PostSettings } from "../../setting"

const basePath = process.env.NEXT_PUBLIC_BASEPATH as string
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error("Missing credentials")
        }
        const res = await fetch(
          `${basePath}user/login2`,
          PostSettings(credentials)
        )
        const user = await res.json()
        if (res?.ok && user) {
          if (user.detail) {
            return null
          }
          return user
        } else {
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(`${basePath}user/auser/${user?.email}`, auth)

          const userData = await res.json()

          if (res?.ok && userData && !userData.detail) {
            account.userData = {
              id: userData.id,
              name: userData.firstname || user.name || "Guest",
              email: userData.email,
              token: userData.token || "",
              roles: userData.roles || ["Guest"],
              image: userData.dp || user.image || null,
            }

            return true
          } else {
            return false
          }
        } catch {
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.userData) {
        token.accessToken = account.userData.token
        token.id = account.userData.id
        token.roles = account.userData.roles
        token.user = account.userData
      } else if (user) {
        token.accessToken = user.token || user.timestamp
        token.id = user.id
        token.roles = user.roles || ["Guest"]
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token?.accessToken
      session.user = token?.user
      return session
    },
  },
  pages: {
    signIn: "/login/",
    signOut: "/logout/",
    error: "/login/",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
