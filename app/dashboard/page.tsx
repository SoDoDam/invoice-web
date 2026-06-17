import type { Metadata } from "next"
import { StatsCard } from "@/components/dashboard/stats-card"
import { OverviewTabs } from "@/components/dashboard/overview-tabs"
import { MOCK_STATS, MOCK_ACTIVITIES } from "@/lib/constants"

export const metadata: Metadata = {
  title: "대시보드",
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          서비스 현황을 한눈에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {MOCK_STATS.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <OverviewTabs activities={MOCK_ACTIVITIES} />
    </div>
  )
}
