import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ActivityItem } from "@/lib/types"

function AnalyticsPlaceholder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>분석</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="size-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-14 rounded-full shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function OverviewTabs({ activities }: { activities: ActivityItem[] }) {
  return (
    <Tabs defaultValue="activity">
      <TabsList className="mb-4">
        <TabsTrigger value="activity">최근 활동</TabsTrigger>
        <TabsTrigger value="analytics">분석</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <RecentActivity activities={activities} />
      </TabsContent>
      <TabsContent value="analytics">
        <AnalyticsPlaceholder />
      </TabsContent>
    </Tabs>
  )
}
