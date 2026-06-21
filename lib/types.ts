// 인보이스 상태
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

// 통화 타입
export type Currency = "KRW" | "USD" | "EUR"

// 인보이스 핵심 타입 (Notion 데이터 모델 매핑)
export type Invoice = {
  id: string
  invoiceNumber: string
  client: string
  amount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  description: string
  currency: Currency
  notionUrl: string
  accessCode?: string
}

export type CreateInvoiceInput = Omit<Invoice, "id" | "notionUrl">

export type UpdateInvoiceInput = Partial<CreateInvoiceInput>

// 대시보드 통계 타입
export type InvoiceSummary = {
  totalCount: number
  paidAmount: number
  pendingAmount: number
  overdueCount: number
}

// 네비게이션 링크 타입
export type NavLink = {
  label: string
  href: string
}

// 대시보드 통계 카드 타입
export type StatCard = {
  title: string
  value: string
  icon: string
}
