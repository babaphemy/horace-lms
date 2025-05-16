import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PostSettings } from "../../setting"

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
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
  ],
  session: {
    jwt: true,
    maxAge: 60 * 60,
  },
  callbacks: {
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
