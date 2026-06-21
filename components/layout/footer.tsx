import { SITE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
