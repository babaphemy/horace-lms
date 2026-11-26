import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { LmsAuthorization } from "@/utils/lmsAuthorization"

export async function middleware(request: NextRequest) {
  const isMemberAdministration =
    request.nextUrl.pathname.replace(/\/$/, "") ===
    "/dashboard/settings/org/members"
  if (
    isMemberAdministration ||
    request.nextUrl.pathname === "/mentor" ||
    request.nextUrl.pathname.startsWith("/mentor/")
  ) {
    const token = await getToken({ req: request })
    if (!token) return NextResponse.redirect(new URL("/login", request.url))
    const authorization = new LmsAuthorization({
      id: token.id,
      roles: token.roles,
    })
    if (
      isMemberAdministration
        ? !authorization.isAdmin()
        : !authorization.canAccessMentorRoutes()
    ) {
      return new NextResponse("Forbidden", { status: 403 })
    }
  }
  const requestHeaders = new Headers(request.headers)
  // const location = request.headers.get('x-vercel-ip-country');
  const loc2 = requestHeaders.get("x-vercel-ip-country") || "US"

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set("x-country", loc2)
  response.headers.set("x-vercel-ip-country", loc2)

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
