import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  type?: "button" | "submit" | "reset"
}

export function ActionButton({ 
  children, 
  onClick, 
  className,
  disabled = false,
  variant = "default",
  size = "default",
  type = "button"
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 min-w-[80px] bg-gradient-to-r from-primary to-accent text-white hover:from-primary-glow hover:to-accent transition-all duration-300",
        className
      )}
    >
      {children}
    </Button>
  )
}