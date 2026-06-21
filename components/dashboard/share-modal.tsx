"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Invoice } from "@/lib/types"

type Props = {
  invoice: Invoice | null
  onClose: () => void
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="클립보드에 복사"
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
    </Button>
  )
}

export function ShareModal({ invoice, onClose }: Props) {
  if (!invoice) return null

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const invoiceUrl = `${baseUrl}/invoice?number=${encodeURIComponent(invoice.invoiceNumber)}`
  const accessCode = invoice.accessCode ?? "접근 코드 없음"

  return (
    <Dialog open={!!invoice} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>인보이스 공유</DialogTitle>
          <DialogDescription>
            {invoice.invoiceNumber} — {invoice.client}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>조회 링크</Label>
            <div className="flex gap-2">
              <Input value={invoiceUrl} readOnly className="font-mono text-xs" />
              <CopyButton value={invoiceUrl} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>접근 코드</Label>
            <div className="flex gap-2">
              <Input
                value={accessCode}
                readOnly
                type="text"
                className="font-mono tracking-widest"
              />
              <CopyButton value={accessCode} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            클라이언트에게 위 링크와 접근 코드를 함께 전달하세요.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
