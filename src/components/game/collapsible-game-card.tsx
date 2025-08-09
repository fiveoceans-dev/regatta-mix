import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

interface CollapsibleGameCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  position: "left" | "right"
  defaultOpen?: boolean
}

export function CollapsibleGameCard({ 
  title, 
  icon, 
  children, 
  position,
  defaultOpen = false 
}: CollapsibleGameCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border transition-all duration-300">
      <CardContent className="p-0">
        {/* Always visible header with icon and title */}
        <Button
          variant="ghost"
          onClick={handleToggle}
          className="w-full p-3 h-auto flex items-center justify-between hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className={`text-sm font-semibold text-primary transition-all ${
              isExpanded ? 'block' : 'hidden sm:block'
            }`}>
              {title}
            </span>
          </div>
          <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''} ${
            isExpanded ? 'block' : 'hidden sm:block'
          }`}>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>

        {/* Expandable content */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="p-3 pt-0">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}