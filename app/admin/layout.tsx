import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

const ADMIN_TOKEN_COOKIE = "admin_token"
const JWT_SECRET = process.env.JWT_SECRET ?? ""

// Edge Runtime 환경이 아닌 Node.js 환경에서 토큰 검증
function verifyAdminToken(token: string): boolean {
  if (!JWT_SECRET) return false
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    return decoded.endsWith(`:${JWT_SECRET}`) && decoded.startsWith("admin:")
  } catch {
    return false
  }
}

// 관리자 레이아웃 — 토큰 유효 시 사이드바 포함, 없으면 children만 렌더
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value
  const isAuthenticated = !!token && verifyAdminToken(token)

  // 인증되지 않은 경우 (예: /admin/login 접근) — 사이드바 없이 children만 렌더링
  if (!isAuthenticated) {
    return <>{children}</>
  }

  // 인증된 경우 — 사이드바 + 메인 콘텐츠 레이아웃 적용
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
