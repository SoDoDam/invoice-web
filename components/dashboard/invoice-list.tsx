"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShareModal } from "@/components/dashboard/share-modal"
import { INVOICE_STATUS_CONFIG, CURRENCY_CONFIG } from "@/lib/constants"
import type { Invoice } from "@/lib/types"

type Props = {
  invoices: Invoice[]
}

function formatCurrency(amount: number, currency: Invoice["currency"]): string {
  const config = CURRENCY_CONFIG[currency]
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(amount)
}

export function InvoiceList({ invoices }: Props) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          인보이스가 없습니다.
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>인보이스 목록</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">번호</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">클라이언트</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">금액</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">발급일</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">공유</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => {
                  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status]
                  return (
                    <tr
                      key={invoice.id}
                      className={i < invoices.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-4 py-3 font-mono text-xs">{invoice.invoiceNumber}</td>
                      <td className="px-4 py-3">{invoice.client}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {invoice.issueDate}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedInvoice(invoice)}
                          aria-label={`${invoice.invoiceNumber} 공유`}
                        >
                          <Share2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ShareModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  )
}
