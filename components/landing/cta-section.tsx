"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    toast.success("구독 완료!", {
      description: `${email}로 최신 소식을 보내드리겠습니다.`,
    })
    setEmail("")
    setLoading(false)
  }

  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          지금 바로 시작하세요
        </h2>
        <p className="mt-4 text-primary-foreground/80">
          이메일을 등록하고 업데이트 소식을 가장 먼저 받아보세요.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:max-w-md sm:mx-auto"
        >
          <Input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border-primary-foreground/20 focus-visible:border-primary-foreground/50"
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={loading}
            className="shrink-0"
          >
            {loading ? "처리 중..." : "구독하기"}
          </Button>
        </form>
      </div>
    </section>
  )
}
