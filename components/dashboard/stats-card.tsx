import { FileText, DollarSign, Clock, AlertCircle, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatCard } from "@/lib/types"

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
}

export function StatsCard({ title, value, icon }: StatCard) {
  const Icon = ICON_MAP[icon]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-md bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
