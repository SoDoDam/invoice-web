"use client"

import { useState } from "react"
import { Check, Link } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CURRENCY_CONFIG, INVOICE_STATUS_CONFIG } from "@/lib/constants"
import type { Currency, Invoice, InvoiceStatus } from "@/lib/types"

// 금액을 통화 포맷에 맞게 변환
function formatCurrency(amount: number, currency: Currency): string {
  const { locale, currency: currencyCode } = CURRENCY_CONFIG[currency]
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currency === "KRW" ? 0 : 2,
  }).format(amount)
}

// 인라인 링크 복사 버튼 컴포넌트 (Task 010)
function CopyLinkButton({ invoiceNumber }: { invoiceNumber: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // 접근 코드는 URL에 포함하지 않음 — 번호만 전달
    const shareUrl = `${window.location.origin}/invoice?number=${encodeURIComponent(invoiceNumber)}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("링크가 복사되었습니다.")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("복사에 실패했습니다. 직접 선택하여 복사해 주세요.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="링크 복사"
    >
      {copied ? (
        <Check className="size-4 text-emerald-500" />
      ) : (
        <Link className="size-4" />
      )}
    </Button>
  )
}

type InvoiceTableProps = {
  invoices: Invoice[]
}

// 견적서 목록 테이블 컴포넌트 (클라이언트 — 검색/필터 상태 관리)
export function InvoiceTable({ invoices }: InvoiceTableProps) {
  // 상태 필터 ("all" 또는 특정 InvoiceStatus)
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")
  // 검색어 (인보이스 번호 또는 클라이언트명)
  const [searchQuery, setSearchQuery] = useState("")

  // 필터링된 인보이스 목록 계산
  const filtered = invoices
    .filter((invoice) =>
      statusFilter === "all" ? true : invoice.status === statusFilter
    )
    .filter((invoice) => {
      if (searchQuery === "") return true
      const query = searchQuery.toLowerCase()
      return (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.client.toLowerCase().includes(query)
      )
    })

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 영역 */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="인보이스 번호 또는 클라이언트 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as InvoiceStatus | "all")
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="draft">초안</SelectItem>
            <SelectItem value="sent">발송됨</SelectItem>
            <SelectItem value="paid">완료</SelectItem>
            <SelectItem value="overdue">연체</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테이블 영역 */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                번호
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                클라이언트
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                금액
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                상태
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                발급일
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  {invoices.length === 0
                    ? "인보이스가 없습니다."
                    : "검색 결과가 없습니다."}
                </td>
              </tr>
            ) : (
              filtered.map((invoice) => {
                const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
                return (
                  <tr
                    key={invoice.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* 인보이스 번호 — 고정 폭 폰트로 가독성 향상 */}
                    <td className="px-4 py-3 font-mono text-xs">
                      {invoice.invoiceNumber}
                    </td>
                    {/* 클라이언트명 */}
                    <td className="px-4 py-3">{invoice.client}</td>
                    {/* 금액 (우측 정렬) */}
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </td>
                    {/* 상태 배지 */}
                    <td className="px-4 py-3 text-center">
                      <Badge className={statusConfig.className}>
                        {statusConfig.label}
                      </Badge>
                    </td>
                    {/* 발급일 */}
                    <td className="px-4 py-3 text-muted-foreground">
                      {invoice.issueDate}
                    </td>
                    {/* 액션 — 링크 복사 버튼 */}
                    <td className="px-4 py-3 text-center">
                      <CopyLinkButton
                        invoiceNumber={invoice.invoiceNumber}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 결과 건수 표시 */}
      {invoices.length > 0 && (
        <p className="text-xs text-muted-foreground">
          총 {invoices.length}건 중 {filtered.length}건 표시
        </p>
      )}
    </div>
  )
}
