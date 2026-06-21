import Link from "next/link"
import { SITE_NAME } from "@/lib/constants"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/invoice" className="font-bold text-lg tracking-tight">
          {SITE_NAME}
        </Link>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
