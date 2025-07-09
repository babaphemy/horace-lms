import NextAuth, { NextAuthOptions, Session } from "next-auth"
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
          return {
            id: user.id,
            email: user.email,
            name: user.firstname || user.name || "Guest",
            token: user.token || "",
            roles: user.roles || ["Guest"],
            image: user.dp || user.image || null,
            firstname: user.firstname,
            lastname: user.lastname,
          }
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
              firstname: userData.firstname,
              lastname: userData.lastname,
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
        const { token: accToken, ...userData } = account.userData
        token.accessToken = accToken
        token.id = userData.id
        token.roles = userData.roles
        token.user = userData
      } else if (user) {
        token.accessToken = user.token || ""
        token.id = user.id
        token.roles = user.roles || ["Guest"]
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          image: user.image,
          firstname: user.firstname,
          lastname: user.lastname,
        }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token?.accessToken
      session.user = {
        ...session.user,
        ...token?.user,
        id: token?.id,
      } as Session["user"]
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
