import Link from "next/link"
import { ArrowRight, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_60%,transparent_100%)] opacity-40" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5">
          Next.js 16 · React 19 · Tailwind CSS v4
        </Badge>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          모던 웹 개발의{" "}
          <span className="text-primary">새로운 시작점</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          shadcn/ui · TypeScript · 다크모드가 완벽하게 갖춰진 프로덕션 레디
          스타터킷. 설정 없이 바로 개발을 시작하세요.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/dashboard">
              대시보드 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code2 className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
