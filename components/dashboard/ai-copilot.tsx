"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles,
  FileText,
  Calendar,
  MessageSquare,
  Lightbulb,
  X,
  Maximize2,
  Minimize2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AICoPilotProps {
  fullscreen?: boolean
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickActions = [
  { label: "Summarize MCD Report", icon: FileText },
  { label: "Draft Speech", icon: MessageSquare },
  { label: "Schedule Meeting", icon: Calendar },
  { label: "Get Issue Insights", icon: Lightbulb },
]

const sampleMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Good morning! I've analyzed the overnight feedback from your constituency. There are 3 priority issues that need your attention:\n\n1. **Water supply disruption** in Ward 7 (42 complaints)\n2. **Drainage overflow** near Jama Masjid (28 complaints)\n3. **Street light outage** in Darya Ganj (19 complaints)\n\nWould you like me to draft a response strategy or schedule a site visit?",
    timestamp: new Date(Date.now() - 3600000),
    suggestions: ["Draft response for Ward 7", "Schedule site visit", "View detailed report"]
  },
  {
    id: "2",
    role: "user",
    content: "What did the MCD report say about Ward 7 drainage?",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "3",
    role: "assistant", 
    content: "According to the MCD report dated March 8, 2026:\n\n**Ward 7 Drainage Status:**\n- Main drain at Chandni Chowk is operating at 85% capacity\n- 3 junction boxes need immediate repair\n- Estimated repair cost: ₹4.2 lakhs\n- Timeline: 5-7 working days\n\nThe report also mentions that pre-monsoon cleaning was delayed by 2 weeks. I recommend scheduling a coordination meeting with MCD officials this week.",
    timestamp: new Date(Date.now() - 900000),
    suggestions: ["Schedule MCD meeting", "Draft follow-up letter", "View full report"]
  }
]

export function AICoPilot({ fullscreen = false }: AICoPilotProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I understand your query. Let me analyze the relevant data from your constituency feedback and government reports. Based on the current sentiment analysis and recent complaints, I can provide you with actionable insights.\n\nWould you like me to elaborate on any specific aspect?",
        timestamp: new Date(),
        suggestions: ["Show more details", "Generate action plan", "Share with team"]
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  if (fullscreen) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <Card className="flex-1 flex flex-col bg-card border-border">
          <CardHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg text-card-foreground">AI Co-Pilot</CardTitle>
                  <p className="text-sm text-muted-foreground">Your intelligent governance assistant</p>
                </div>
              </div>
              <div className="flex gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button 
                      key={action.label} 
                      variant="outline" 
                      size="sm"
                      className="gap-2 text-xs border-border text-foreground"
                    >
                      <Icon className="h-3 w-3" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} onSuggestionClick={handleSuggestionClick} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </ScrollArea>
            <InputArea 
              input={input} 
              setInput={setInput} 
              onSend={handleSend} 
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Floating panel version
  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
      >
        <Bot className="h-6 w-6 text-primary-foreground" />
      </Button>
    )
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[9999] flex flex-col rounded-xl border border-border bg-card shadow-2xl transition-all duration-300",
      isExpanded ? "h-[600px] w-[450px]" : "h-[500px] w-[380px]"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">AI Co-Pilot</h3>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-1 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
              </span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setIsMinimized(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 overflow-x-auto border-b border-border p-3">
        {quickActions.slice(0, 3).map((action) => {
          const Icon = action.icon
          return (
            <Badge 
              key={action.label} 
              variant="secondary"
              className="cursor-pointer whitespace-nowrap bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              <Icon className="mr-1 h-3 w-3" />
              {action.label}
            </Badge>
          )
        })}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onSuggestionClick={handleSuggestionClick} compact />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Input */}
      <InputArea 
        input={input} 
        setInput={setInput} 
        onSend={handleSend}
        compact
      />
    </div>
  )
}

function MessageBubble({ 
  message, 
  onSuggestionClick,
  compact = false 
}: { 
  message: Message
  onSuggestionClick: (suggestion: string) => void
  compact?: boolean 
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8", compact && "h-7 w-7")}>
        <AvatarFallback className={cn(
          isUser ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
        )}>
          {isUser ? "U" : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn("max-w-[80%] space-y-2", isUser && "items-end")}>
        <div className={cn(
          "rounded-lg px-4 py-2",
          isUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground",
          compact && "px-3 py-1.5 text-sm"
        )}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.suggestions && (
          <div className="flex flex-wrap gap-1">
            {message.suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-7 text-xs border-border text-foreground"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <Sparkles className="mr-1 h-3 w-3 text-primary" />
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="rounded-lg bg-secondary px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </div>
    </div>
  )
}

function InputArea({ 
  input, 
  setInput, 
  onSend,
  compact = false
}: { 
  input: string
  setInput: (value: string) => void
  onSend: () => void
  compact?: boolean
}) {
  return (
    <div className={cn("border-t border-border p-4", compact && "p-3")}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask anything about your constituency..."
          className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground"
        />
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
          <Mic className="h-4 w-4" />
        </Button>
        <Button size="icon" className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90" onClick={onSend}>
          <Send className="h-4 w-4 text-primary-foreground" />
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Powered by XLM-RoBERTa sentiment analysis
      </p>
    </div>
  )
}
