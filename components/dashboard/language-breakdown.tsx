"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts"
import { cn } from "@/lib/utils"

interface LanguageBreakdownProps {
  expanded?: boolean
}

const languageData = [
  { name: "Hindi", value: 42, color: "oklch(0.75 0.18 85)", sentiment: 74 },
  { name: "English", value: 28, color: "oklch(0.7 0.18 145)", sentiment: 71 },
  { name: "Hinglish", value: 18, color: "oklch(0.65 0.2 45)", sentiment: 68 },
  { name: "Punjabi", value: 7, color: "oklch(0.6 0.15 250)", sentiment: 76 },
  { name: "Others", value: 5, color: "oklch(0.55 0.22 25)", sentiment: 65 },
]

const translationStats = [
  { label: "Messages Translated", value: "24,847", subtext: "Last 24 hours" },
  { label: "Languages Detected", value: "14", subtext: "Out of 22 supported" },
  { label: "Translation Accuracy", value: "96.8%", subtext: "IndicTrans2 model" },
]

export function LanguageBreakdown({ expanded = false }: LanguageBreakdownProps) {
  return (
    <Card className={cn("bg-card border-border", expanded && "col-span-full")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-card-foreground">Language Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">Feedback by language with IndicTrans2 translation</p>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-6", expanded ? "lg:grid-cols-3" : "")}>
          {/* Pie Chart */}
          <div className={cn("h-48", expanded && "h-64")}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={expanded ? 50 : 40}
                  outerRadius={expanded ? 80 : 65}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(0.18 0.025 250)", 
                    border: "1px solid oklch(0.3 0.04 250)",
                    borderRadius: "8px",
                    color: "oklch(0.98 0 0)"
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Language List */}
          <div className="space-y-3">
            {languageData.map((lang) => (
              <div key={lang.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm font-medium text-card-foreground">{lang.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{lang.value}%</span>
                </div>
                <Progress 
                  value={lang.value} 
                  className="h-1.5 bg-secondary" 
                />
              </div>
            ))}
          </div>

          {/* Translation Stats */}
          {expanded && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-card-foreground">Translation Engine</h4>
              {translationStats.map((stat) => (
                <div key={stat.label} className="rounded-lg bg-secondary p-3">
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bharat-First Badge */}
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-primary-foreground">B</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-card-foreground">Bharat-First Language Support</p>
            <p className="text-xs text-muted-foreground">22+ Indian languages via IndicTrans2 + XLM-RoBERTa</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
