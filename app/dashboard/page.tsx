import type { Metadata } from "next"
import { Suspense } from "react"

// Notion API 호출이 있으므로 정적 생성 비활성화
export const dynamic = "force-dynamic"
import { StatsCard } from "@/components/dashboard/stats-card"
import { InvoiceList } from "@/components/dashboard/invoice-list"
import { adminLogoutAction } from "@/app/actions/admin"
import { getInvoiceSummary, getInvoices } from "@/lib/notion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import type { InvoiceSummary, StatCard } from "@/lib/types"

export const metadata: Metadata = {
  title: "대시보드",
}

// InvoiceSummary를 StatCard 배열로 변환
function summaryToStatCards(summary: InvoiceSummary): StatCard[] {
  return [
    {
      title: "총 인보이스",
      value: `${summary.totalCount}건`,
      icon: "FileText",
    },
    {
      title: "수금 완료",
      value: `₩${summary.paidAmount.toLocaleString("ko-KR")}`,
      icon: "DollarSign",
    },
    {
      title: "미수금",
      value: `₩${summary.pendingAmount.toLocaleString("ko-KR")}`,
      icon: "Clock",
    },
    {
      title: "연체",
      value: `${summary.overdueCount}건`,
      icon: "AlertCircle",
    },
  ]
}

// 스켈레톤 로딩 UI
function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>
      <Skeleton className="h-96" />
    </>
  )
}

// 실제 대시보드 콘텐츠 (async Server Component)
async function DashboardContent() {
  const [summary, invoices] = await Promise.all([
    getInvoiceSummary(),
    getInvoices(),
  ])

  const stats = summaryToStatCards(summary)

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <InvoiceList invoices={invoices} />
    </>
  )
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            인보이스 현황을 확인하고 공유 링크를 생성하세요.
          </p>
        </div>
        <form action={adminLogoutAction}>
          <Button type="submit" variant="outline" size="sm">
            로그아웃
          </Button>
        </form>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
