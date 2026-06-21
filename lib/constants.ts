import type { NavLink } from "@/lib/types"

export const SITE_NAME = "Invoice Web"
export const SITE_DESCRIPTION = "Notion 기반 인보이스 조회 및 관리 시스템"

// 관리자용 네비게이션 링크
export const ADMIN_NAV_LINKS: NavLink[] = [
  { label: "대시보드", href: "/dashboard" },
]

// 인보이스 상태 표시 설정
export const INVOICE_STATUS_CONFIG = {
  draft: { label: "초안", className: "bg-muted text-muted-foreground" },
  sent: { label: "발송됨", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  paid: { label: "완료", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  overdue: { label: "연체", className: "bg-destructive/10 text-destructive" },
} as const

// 통화 포맷 설정
export const CURRENCY_CONFIG = {
  KRW: { locale: "ko-KR", currency: "KRW" },
  USD: { locale: "en-US", currency: "USD" },
  EUR: { locale: "de-DE", currency: "EUR" },
} as const
