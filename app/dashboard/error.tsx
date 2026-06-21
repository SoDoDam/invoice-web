"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("대시보드 오류:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-destructive mb-2">오류가 발생했습니다</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Notion 데이터를 불러오는 중에 문제가 발생했습니다.
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-muted-foreground bg-muted p-3 rounded mb-4 max-w-md text-left">
            {error.message}
          </p>
        )}
      </div>
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </div>
  )
}
