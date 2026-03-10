"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, AlertTriangle, ThumbsUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Overall Sentiment",
    value: "72%",
    change: "+5.2%",
    trend: "up",
    icon: ThumbsUp,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    label: "Active Issues",
    value: "156",
    change: "-12",
    trend: "down",
    icon: AlertTriangle,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    label: "Feedback Today",
    value: "2,847",
    change: "+324",
    trend: "up",
    icon: MessageSquare,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    label: "Citizens Reached",
    value: "45.2K",
    change: "+2.1K",
    trend: "up",
    icon: Users,
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
        
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendIcon 
                      className={cn(
                        "h-4 w-4",
                        stat.trend === "up" ? "text-chart-1" : "text-destructive"
                      )} 
                    />
                    <span 
                      className={cn(
                        "text-sm font-medium",
                        stat.trend === "up" ? "text-chart-1" : "text-destructive"
                      )}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last week</span>
                  </div>
                </div>
                <div className={cn("rounded-lg p-3", stat.bgColor)}>
                  <Icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
