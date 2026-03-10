"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Legend
} from "recharts"
import { cn } from "@/lib/utils"

interface SentimentChartProps {
  expanded?: boolean
}

// Generate sample data
const generateSentimentData = () => {
  const hours = ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM", "8PM", "10PM"]
  return hours.map((hour, index) => ({
    time: hour,
    positive: Math.floor(Math.random() * 30) + 50,
    neutral: Math.floor(Math.random() * 20) + 20,
    negative: Math.floor(Math.random() * 15) + 10,
    total: Math.floor(Math.random() * 500) + 200,
  }))
}

const weeklyData = [
  { day: "Mon", sentiment: 72, feedback: 2847, issues: 34 },
  { day: "Tue", sentiment: 68, feedback: 3102, issues: 41 },
  { day: "Wed", sentiment: 75, feedback: 2654, issues: 28 },
  { day: "Thu", sentiment: 71, feedback: 2987, issues: 32 },
  { day: "Fri", sentiment: 69, feedback: 3421, issues: 38 },
  { day: "Sat", sentiment: 78, feedback: 2156, issues: 22 },
  { day: "Sun", sentiment: 82, feedback: 1876, issues: 18 },
]

const sourceData = [
  { source: "Twitter/X", count: 1247, sentiment: 68 },
  { source: "WhatsApp", count: 987, sentiment: 74 },
  { source: "CM Helpline", count: 654, sentiment: 62 },
  { source: "News Portal", count: 432, sentiment: 58 },
  { source: "Direct App", count: 321, sentiment: 81 },
]

export function SentimentChart({ expanded = false }: SentimentChartProps) {
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today")
  const [chartType, setChartType] = useState<"area" | "bar">("area")
  const [data, setData] = useState(generateSentimentData())
  const [isLive, setIsLive] = useState(true)

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setData(generateSentimentData())
    }, 5000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <Card className={cn("bg-card border-border", expanded && "col-span-2")}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg text-card-foreground">Live Sentiment Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Real-time feedback sentiment from all sources</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <span className={cn(
              "relative flex h-2 w-2",
              isLive && "animate-pulse"
            )}>
              <span className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                isLive ? "bg-chart-1 animate-ping" : "bg-muted-foreground"
              )} />
              <span className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isLive ? "bg-chart-1" : "bg-muted-foreground"
              )} />
            </span>
            <span className={cn(
              "text-sm font-medium",
              isLive ? "text-chart-1" : "text-muted-foreground"
            )}>
              {isLive ? "Live" : "Paused"}
            </span>
          </div>
          
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Chart */}
        <div className={cn("w-full", expanded ? "h-96" : "h-64")}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={timeRange === "week" ? weeklyData : data}>
                <defs>
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.7 0.18 145)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 250)" />
                <XAxis 
                  dataKey={timeRange === "week" ? "day" : "time"} 
                  stroke="oklch(0.65 0 0)"
                  fontSize={12}
                />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                />
                <Legend />
                {timeRange === "week" ? (
                  <Area 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="oklch(0.7 0.18 145)" 
                    fill="url(#positiveGradient)"
                    name="Sentiment %"
                  />
                ) : (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="positive" 
                      stackId="1"
                      stroke="oklch(0.7 0.18 145)" 
                      fill="url(#positiveGradient)"
                      name="Positive"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="neutral" 
                      stackId="1"
                      stroke="oklch(0.75 0.18 85)" 
                      fill="url(#neutralGradient)"
                      name="Neutral"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="negative" 
                      stackId="1"
                      stroke="oklch(0.55 0.22 25)" 
                      fill="url(#negativeGradient)"
                      name="Negative"
                    />
                  </>
                )}
              </AreaChart>
            ) : (
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 250)" />
                <XAxis dataKey="source" stroke="oklch(0.65 0 0)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="oklch(0.75 0.18 85)" name="Feedback Count" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sentiment" fill="oklch(0.7 0.18 145)" name="Sentiment %" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Type Toggle */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex gap-2">
            <Button
              variant={chartType === "area" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("area")}
              className="text-xs"
            >
              Trend View
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="text-xs border-border"
            >
              Source View
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? "Pause Updates" : "Resume Live"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
