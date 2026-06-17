import type { NavLink, Feature, StatCard, ActivityItem } from "@/lib/types"

export const SITE_NAME = "StarterKit"
export const SITE_DESCRIPTION =
  "Next.js · TypeScript · Tailwind CSS · shadcn/ui로 구성된 모던 웹 스타터킷"

export const NAV_LINKS: NavLink[] = [
  { label: "홈", href: "/" },
  { label: "대시보드", href: "/dashboard" },
]

export const FEATURES: Feature[] = [
  {
    icon: "Zap",
    title: "빠른 성능",
    description:
      "Next.js App Router와 React Server Components로 초고속 로딩을 제공합니다.",
  },
  {
    icon: "Shield",
    title: "타입 안전",
    description:
      "TypeScript + Zod로 컴파일 타임부터 런타임까지 완벽한 타입 안전성을 보장합니다.",
  },
  {
    icon: "Palette",
    title: "세련된 UI",
    description:
      "shadcn/ui + Tailwind CSS v4로 아름답고 접근성 높은 컴포넌트를 즉시 활용하세요.",
  },
  {
    icon: "Moon",
    title: "다크 모드",
    description:
      "next-themes로 시스템 설정을 감지하고 라이트/다크 모드를 자유롭게 전환합니다.",
  },
]

export const MOCK_STATS: StatCard[] = [
  { title: "총 사용자", value: "12,847", trend: 12, icon: "Users" },
  { title: "월 매출", value: "₩48.2M", trend: 8, icon: "DollarSign" },
  { title: "신규 주문", value: "3,291", trend: -3, icon: "ShoppingCart" },
  { title: "전환율", value: "4.7%", trend: 1, icon: "TrendingUp" },
]

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    user: "김민준",
    avatar: "김",
    action: "새 프로젝트를 생성했습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: "success",
  },
  {
    id: "2",
    user: "이서연",
    avatar: "이",
    action: "결제를 완료했습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 23),
    status: "success",
  },
  {
    id: "3",
    user: "박도현",
    avatar: "박",
    action: "파일 업로드를 시도했습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    status: "pending",
  },
  {
    id: "4",
    user: "최지아",
    avatar: "최",
    action: "API 연동을 요청했습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    status: "failed",
  },
  {
    id: "5",
    user: "정하늘",
    avatar: "정",
    action: "계정 정보를 업데이트했습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: "success",
  },
]
