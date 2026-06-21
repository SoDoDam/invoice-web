"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createInvoice, updateInvoice, deleteInvoice } from "@/lib/notion"
import type { InvoiceStatus } from "@/lib/types"

// Zod 검증 스키마
const InvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "인보이스 번호를 입력하세요"),
  client: z.string().min(1, "고객명을 입력하세요"),
  amount: z.number().nonnegative("금액은 0 이상이어야 합니다"),
  status: z.enum(["draft", "sent", "paid", "overdue"]),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD입니다"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "날짜 형식은 YYYY-MM-DD입니다"),
  description: z.string().optional().default(""),
  currency: z.enum(["KRW", "USD", "EUR"]).default("KRW"),
})

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function createInvoiceAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const raw = {
    invoiceNumber: formData.get("invoiceNumber"),
    client: formData.get("client"),
    amount: Number(formData.get("amount")),
    status: formData.get("status") as InvoiceStatus,
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description") ?? "",
    currency: formData.get("currency") ?? "KRW",
  }

  const parsed = InvoiceSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const invoice = await createInvoice(parsed.data)
    revalidatePath("/dashboard")
    revalidatePath("/invoices")
    return { success: true, data: { id: invoice.id } }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return { success: false, error: `인보이스 생성 실패: ${message}` }
  }
}

export async function updateInvoiceAction(
  id: string,
  formData: FormData
): Promise<ActionResult<void>> {
  const raw = {
    invoiceNumber: formData.get("invoiceNumber"),
    client: formData.get("client"),
    amount: formData.get("amount") ? Number(formData.get("amount")) : undefined,
    status: formData.get("status"),
    issueDate: formData.get("issueDate"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
    currency: formData.get("currency"),
  }

  // undefined 값 제거
  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined)
  )

  const parsed = InvoiceSchema.partial().safeParse(cleaned)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    await updateInvoice(id, parsed.data)
    revalidatePath("/dashboard")
    revalidatePath("/invoices")
    return { success: true, data: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return { success: false, error: `인보이스 수정 실패: ${message}` }
  }
}

export async function deleteInvoiceAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await deleteInvoice(id)
    revalidatePath("/dashboard")
    revalidatePath("/invoices")
    return { success: true, data: undefined }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return { success: false, error: `인보이스 삭제 실패: ${message}` }
  }
}
