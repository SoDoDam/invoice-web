import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { ActivityItem, ActivityStatus } from "@/lib/types"

function formatRelativeTime(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("ko", { numeric: "auto" })
  const diffMs = date.getTime() - Date.now()
  const diffSec = Math.round(diffMs / 1000)
  const diffMin = Math.round(diffSec / 60)
  const diffHour = Math.round(diffMin / 60)

  if (Math.abs(diffMin) < 1) return rtf.format(diffSec, "second")
  if (Math.abs(diffHour) < 1) return rtf.format(diffMin, "minute")
  return rtf.format(diffHour, "hour")
}

const STATUS_CONFIG: Record<
  ActivityStatus,
  { label: string; className: string }
> = {
  success: {
    label: "완료",
    className: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400",
  },
  pending: {
    label: "진행 중",
    className: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400",
  },
  failed: {
    label: "실패",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
}

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {activities.map((item, i) => {
            const status = STATUS_CONFIG[item.status]
            return (
              <li key={item.id}>
                <div className="flex items-center gap-4 px-6 py-4">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="text-sm font-medium">
                      {item.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{item.user}</p>
                    <p className="mt-1 text-sm text-muted-foreground truncate">
                      {item.action}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(item.timestamp)}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs", status.className)}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>
                {i < activities.length - 1 && <Separator />}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
