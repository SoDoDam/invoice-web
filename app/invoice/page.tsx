import type { Metadata } from "next"
import { Suspense } from "react"
import { InvoiceLookupForm } from "@/components/invoice/invoice-lookup-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "인보이스 조회",
  description: "인보이스 번호와 접근 코드를 입력하여 인보이스를 조회하세요.",
}

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export default function InvoicePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">인보이스 조회</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            인보이스 번호와 접근 코드를 입력해 주세요.
          </p>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <InvoiceLookupForm />
        </Suspense>
      </div>
    </div>
  )
}
