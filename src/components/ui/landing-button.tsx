import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LandingButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary"
}

export function LandingButton({ 
  children, 
  onClick, 
  className,
  variant = "primary"
}: LandingButtonProps) {
  return (
    <div className="relative group">
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-green-500 via-red-700 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300 animate-pulse"></div>
      
      {/* Button */}
      <Button
        onClick={onClick}
        className={cn(
          "relative px-8 py-2 rounded-full text-sm font-medium transition-all duration-300",
          variant === "primary" 
            ? "bg-gradient-to-r from-primary to-accent text-white hover:from-primary-glow hover:to-accent shadow-lg hover:shadow-xl" 
            : "bg-background text-foreground border hover:bg-muted",
          className
        )}
      >
        {children}
      </Button>
    </div>
  )
}