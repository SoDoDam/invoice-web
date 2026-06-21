"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getInvoiceByNumber } from "@/lib/notion"
import { getInvoiceSessionKey } from "@/lib/auth"

const InvoiceLookupSchema = z.object({
  invoiceNumber: z.string().min(1, "인보이스 번호를 입력하세요"),
  accessCode: z
    .string()
    .min(6, "접근 코드는 6자리 이상이어야 합니다")
    .max(8, "접근 코드는 8자리 이하여야 합니다"),
})

type VerifyResult = { success: false; error: string }

// 인보이스 접근 코드 검증 및 세션 생성
export async function verifyInvoiceAccessAction(
  formData: FormData
): Promise<VerifyResult> {
  const parsed = InvoiceLookupSchema.safeParse({
    invoiceNumber: formData.get("invoiceNumber"),
    accessCode: formData.get("accessCode"),
  })

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const { invoiceNumber, accessCode } = parsed.data

  // Notion에서 인보이스 조회
  const invoice = await getInvoiceByNumber(invoiceNumber)

  // 인보이스 미존재 또는 접근 코드 불일치 시 동일 오류 반환 (정보 은닉)
  if (!invoice || !invoice.accessCode) {
    return { success: false, error: "인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다." }
  }

  // 상수 시간 비교 (타이밍 공격 방어)
  const isValid = timingSafeEqual(accessCode, invoice.accessCode)
  if (!isValid) {
    return { success: false, error: "인보이스를 찾을 수 없거나 접근 코드가 올바르지 않습니다." }
  }

  // 세션 쿠키 저장 (httpOnly)
  const cookieStore = await cookies()
  const sessionKey = getInvoiceSessionKey(invoiceNumber)

  cookieStore.set(sessionKey, `verified:${invoiceNumber}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24시간
  })

  redirect(`/invoice/${invoiceNumber}`)
}

// 상수 시간 문자열 비교
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
