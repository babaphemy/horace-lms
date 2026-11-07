import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/mentor" ||
    request.nextUrl.pathname.startsWith("/mentor/")
  ) {
    const token = await getToken({ req: request })
    if (!token) return NextResponse.redirect(new URL("/login", request.url))
    if (
      !token.roles?.some(
        (role) => role === "ROLE_ADMIN" || role === "ROLE_INSTRUCTOR"
      )
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
