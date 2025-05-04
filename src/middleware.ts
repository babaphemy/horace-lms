import { NextResponse, NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
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
