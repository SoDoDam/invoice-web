import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PdfDownloadButton } from "@/components/invoice/pdf-download-button"
import { INVOICE_STATUS_CONFIG, CURRENCY_CONFIG } from "@/lib/constants"
import type { Invoice } from "@/lib/types"

type Props = {
  invoice: Invoice
}

function formatCurrency(amount: number, currency: Invoice["currency"]): string {
  const config = CURRENCY_CONFIG[currency]
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString))
}

export function InvoiceTemplate({ invoice }: Props) {
  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME ?? "회사명"
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? ""
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE ?? ""
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? ""

  return (
    <div className="invoice-wrapper">
      {/* PDF 다운로드 버튼 (인쇄 시 숨김) */}
      <div className="mb-6 flex justify-end print:hidden">
        <PdfDownloadButton invoiceNumber={invoice.invoiceNumber} />
      </div>

      {/* 인보이스 본문 */}
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm print:border-none print:shadow-none print:p-0">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
            <p className="mt-1 text-lg font-semibold text-muted-foreground">
              {invoice.invoiceNumber}
            </p>
          </div>
          <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
        </div>

        <Separator className="my-6" />

        {/* 발급처 / 수신처 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              발급처
            </p>
            <p className="font-semibold">{companyName}</p>
            {companyAddress && (
              <p className="text-sm text-muted-foreground">{companyAddress}</p>
            )}
            {companyPhone && (
              <p className="text-sm text-muted-foreground">{companyPhone}</p>
            )}
            {companyEmail && (
              <p className="text-sm text-muted-foreground">{companyEmail}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              수신처
            </p>
            <p className="font-semibold">{invoice.client}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* 날짜 정보 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              발급일
            </p>
            <p className="text-sm">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              납부 기한
            </p>
            <p className="text-sm">{formatDate(invoice.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              통화
            </p>
            <p className="text-sm">{invoice.currency}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* 금액 */}
        <div className="rounded-md bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">합계 금액</span>
            <span className="text-2xl font-bold">
              {formatCurrency(invoice.amount, invoice.currency)}
            </span>
          </div>
        </div>

        {/* 설명 */}
        {invoice.description && (
          <>
            <Separator className="my-6" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                내용
              </p>
              <p className="text-sm whitespace-pre-wrap">{invoice.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
