import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SimpleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  type?: "button" | "submit" | "reset"
}

export function SimpleButton({ 
  children, 
  onClick, 
  className,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button"
}: SimpleButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 w-[110px] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
        className
      )}
    >
      {children}
    </Button>
  )
}