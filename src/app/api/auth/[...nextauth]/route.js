import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PostSettings } from "../../setting"
import GoogleProvider from "next-auth/providers/google"

const basePath = process.env.NEXT_PUBLIC_BASEPATH

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const res = await fetch(
          `${basePath}user/login2`,
          PostSettings(credentials)
        )
        const user = await res.json()
        if (res?.ok && user) {
          if (user.detail) {
            res.status = 401
            return null
          }
          return user
        } else {
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    jwt: true,
    maxAge: 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${basePath}/user/user-by-email?email=${user?.email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )

          const userData = await res.json()

          if (res?.ok && userData) {
            if (userData.detail) {
              res.status = 401
              return `/login?error=${encodeURIComponent("UnAuthorized Login")}`
            }

            user = { ...userData }
            return `/login?success=${encodeURIComponent("Login successful")}`
          } else return `/login?error=${encodeURIComponent("User not found")}`
        } catch {
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = user.token || user.timestamp
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
})
export { handler as GET, handler as POST }
