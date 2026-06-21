"use client"

import { useEffect, useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyInvoiceAccessAction } from "@/app/actions/invoice-client"

const schema = z.object({
  invoiceNumber: z.string().min(1, "인보이스 번호를 입력하세요"),
  accessCode: z
    .string()
    .min(6, "접근 코드는 6자리 이상이어야 합니다")
    .max(8, "접근 코드는 8자리 이하여야 합니다"),
})

type FormValues = z.infer<typeof schema>

type State = { error?: string } | null

async function formAction(_prev: State, formData: FormData): Promise<State> {
  const result = await verifyInvoiceAccessAction(formData)
  return result
}

export function InvoiceLookupForm() {
  const searchParams = useSearchParams()
  const defaultInvoiceNumber = searchParams.get("number") ?? ""

  const [state, action, isPending] = useActionState(formAction, null)

  const {
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoiceNumber: defaultInvoiceNumber,
      accessCode: "",
    },
  })

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="invoiceNumber">인보이스 번호</Label>
        <Input
          id="invoiceNumber"
          {...register("invoiceNumber")}
          name="invoiceNumber"
          placeholder="INV-2024-001"
          defaultValue={defaultInvoiceNumber}
          autoComplete="off"
        />
        {errors.invoiceNumber && (
          <p className="text-xs text-destructive">{errors.invoiceNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessCode">접근 코드</Label>
        <Input
          id="accessCode"
          {...register("accessCode")}
          name="accessCode"
          type="password"
          placeholder="6~8자리 코드"
          autoComplete="off"
        />
        {errors.accessCode && (
          <p className="text-xs text-destructive">{errors.accessCode.message}</p>
        )}
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "확인 중..." : "인보이스 조회"}
      </Button>
    </form>
  )
}
