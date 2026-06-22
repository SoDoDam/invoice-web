"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminLogoutAction } from "@/app/actions/admin"
import { ADMIN_NAV_LINKS } from "@/lib/constants"
import { Button } from "@/components/ui/button"

// 관리자 사이드바 컴포넌트 (클라이언트 컴포넌트 — usePathname 사용)
export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-background border-r flex flex-col">
      {/* 브랜드 영역 */}
      <div className="px-4 py-5 border-b">
        <span className="font-semibold text-sm text-foreground">관리자 메뉴</span>
      </div>

      {/* 네비게이션 링크 목록 */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {ADMIN_NAV_LINKS.map((link) => {
          // 현재 경로와 일치하면 활성 스타일 적용
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors " +
                (isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")
              }
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* 로그아웃 버튼 */}
      <div className="px-2 py-4 border-t">
        <form action={adminLogoutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start text-sm">
            로그아웃
          </Button>
        </form>
      </div>
    </aside>
  )
}
