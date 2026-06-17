import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StatCard } from "@/lib/types"

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
}

export function StatsCard({ title, value, trend, icon }: StatCard) {
  const Icon = ICON_MAP[icon]
  const isPositive = trend >= 0

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
        <div className="mt-1 flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="size-3 text-emerald-500" />
          ) : (
            <TrendingDown className="size-3 text-destructive" />
          )}
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={cn(
              "px-1.5 py-0 text-xs",
              isPositive && "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
            )}
          >
            {isPositive ? "+" : ""}
            {trend}%
          </Badge>
          <span className="text-xs text-muted-foreground">전월 대비</span>
        </div>
      </CardContent>
    </Card>
  )
}
