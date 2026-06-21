"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  invoiceNumber: string
}

export function PdfDownloadButton({ invoiceNumber }: Props) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className="gap-2"
      aria-label={`${invoiceNumber} PDF 다운로드`}
    >
      <Download className="size-4" />
      PDF 다운로드
    </Button>
  )
}
