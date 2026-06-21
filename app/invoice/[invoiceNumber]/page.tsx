import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

// 세션/쿠키 및 Notion API 호출이 있으므로 정적 생성 비활성화
export const dynamic = "force-dynamic"
import { getInvoiceByNumber } from "@/lib/notion"
import { verifyInvoiceSession } from "@/lib/auth"
import { InvoiceTemplate } from "@/components/invoice/invoice-template"

type Props = {
  params: Promise<{ invoiceNumber: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoiceNumber } = await params
  return {
    title: `인보이스 ${invoiceNumber}`,
  }
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { invoiceNumber } = await params

  // 세션 검증: 접근 코드 미인증 시 조회 페이지로 리다이렉트
  const hasSession = await verifyInvoiceSession(invoiceNumber)
  if (!hasSession) {
    redirect(`/invoice?number=${encodeURIComponent(invoiceNumber)}`)
  }

  // Notion에서 인보이스 데이터 조회
  const invoice = await getInvoiceByNumber(invoiceNumber)
  if (!invoice) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <InvoiceTemplate invoice={invoice} />
    </div>
  )
}
