"use client"

import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "heatmap", label: "Booth Heatmaps", icon: Map },
  { id: "sentiment", label: "Sentiment Engine", icon: BarChart3 },
  { id: "copilot", label: "AI Co-Pilot", icon: Bot },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Sidebar({ isOpen, onToggle, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside 
      className={cn(
        "relative flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <span className="text-lg font-bold text-primary-foreground">J</span>
        </div>
        {isOpen && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">JanInsight</span>
            <span className="text-xs text-muted-foreground">Constituency Intel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-primary",
                !isOpen && "justify-center px-2"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {isOpen && <span>{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      {/* Constituency Info */}
      {isOpen && (
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs text-muted-foreground">Active Constituency</p>
            <p className="text-sm font-semibold text-sidebar-foreground">New Delhi - 01</p>
            <p className="text-xs text-muted-foreground">Chandni Chowk</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </aside>
  )
}
