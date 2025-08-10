import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GameButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  icon?: React.ReactNode
}

export function GameButton({ 
  children, 
  onClick, 
  className,
  disabled = false,
  variant = "secondary",
  icon
}: GameButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-6 px-2 text-xs gap-1 min-w-0 w-auto font-medium border-border/50 hover:border-border",
        className
      )}
    >
      {children}
    </Button>
  )
}