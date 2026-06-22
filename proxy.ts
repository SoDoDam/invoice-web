import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_TOKEN_COOKIE = "admin_token"
const JWT_SECRET = process.env.JWT_SECRET ?? ""

// 관리자 토큰 검증 (Edge Runtime에서 Buffer 사용 불가 → atob 사용)
function verifyAdminToken(token: string): boolean {
  if (!JWT_SECRET) return false
  try {
    const decoded = atob(token)
    return decoded.endsWith(`:${JWT_SECRET}`) && decoded.startsWith("admin:")
  } catch {
    return false
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /dashboard 및 /admin/invoices 경로 보호 (/admin/login은 제외)
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin/invoices")
  ) {
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value

    if (!token || !verifyAdminToken(token)) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/invoices/:path*"],
}
