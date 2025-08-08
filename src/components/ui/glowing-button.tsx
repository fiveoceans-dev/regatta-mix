import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "play"
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
}

const GlowingButton = React.forwardRef<HTMLButtonElement, GlowingButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <div className="relative group">
        {/* Animated glow border with pulse effect */}
        <div className="absolute -inset-1 bg-primary rounded-lg blur-sm opacity-60 group-hover:opacity-100 animate-glow-pulse"></div>
        
        {/* Main button */}
        <Button
          ref={ref}
          variant={variant === "play" ? "default" : variant}
          size={size}
          className={cn(
            "relative bg-background border-2 border-primary/60 hover:border-primary text-foreground font-semibold transition-all duration-300",
            "hover:bg-primary/10 hover:shadow-glow",
            variant === "play" && "bg-primary text-primary-foreground hover:bg-primary/90 text-xl px-12 py-8 font-bold tracking-wide",
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </div>
    )
  }
)
GlowingButton.displayName = "GlowingButton"

export { GlowingButton }