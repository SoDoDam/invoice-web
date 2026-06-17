import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { SITE_NAME, NAV_LINKS } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">{SITE_NAME}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Next.js · TypeScript · Tailwind CSS · shadcn/ui
            </p>
          </div>
          <nav className="flex gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
