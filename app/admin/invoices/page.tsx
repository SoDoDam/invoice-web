import { getInvoices } from "@/lib/notion"
import { InvoiceTable } from "@/components/admin/invoice-table"

// Notion API 호출하는 Server Component — 매 요청마다 최신 데이터 반환
export const dynamic = "force-dynamic"

export const metadata = { title: "견적서 목록" }

// 견적서 목록 페이지 (Server Component)
export default async function AdminInvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">견적서 목록</h1>
        <p className="text-muted-foreground mt-1">Notion에서 관리되는 인보이스 목록입니다.</p>
      </div>
      <InvoiceTable invoices={invoices} />
    </div>
  )
}
