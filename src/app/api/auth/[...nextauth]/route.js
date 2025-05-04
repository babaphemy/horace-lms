import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const basePath = process.env.NEXT_PUBLIC_BASEPATH

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const fd = new FormData()
        fd.append("username", credentials.email)
        fd.append("password", credentials.password)
        const res = await fetch(`${basePath}info/login`, {
          method: "POST",
          body: fd,
          credentials: "include",
        })
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
    signIn: "/authentication/sign-in/",
    signOut: "/authentication/logout/",
    error: "/authentication/sign-in/",
  },
})
export { handler as GET, handler as POST }
