import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OvalButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function OvalButton({ 
  children, 
  onClick, 
  className,
  disabled = false
}: OvalButtonProps) {
  return (
    <div className="relative group">
      {/* Animated gradient border with smooth slow pulse */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-green-500 via-red-700 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300 animate-smooth-pulse"></div>
      
      {/* Button */}
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative px-8 py-2 rounded-full text-sm font-medium transition-all duration-300",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
          className
        )}
      >
        {children}
      </Button>
    </div>
  )
}