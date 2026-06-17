export type NavLink = {
  label: string
  href: string
}

export type Feature = {
  icon: string
  title: string
  description: string
}

export type StatCard = {
  title: string
  value: string
  trend: number
  icon: string
}

export type ActivityStatus = "success" | "pending" | "failed"

export type ActivityItem = {
  id: string
  user: string
  avatar: string
  action: string
  timestamp: Date
  status: ActivityStatus
}
