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
        {/* Animated glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary-glow to-primary rounded-lg blur-sm opacity-75 group-hover:opacity-100 animate-glow-spin"></div>
        
        {/* Inner border animation */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary-glow to-primary rounded-lg opacity-50 animate-glow-spin" style={{ animationDelay: "0.5s" }}></div>
        
        {/* Main button */}
        <Button
          ref={ref}
          variant={variant === "play" ? "default" : variant}
          size={size}
          className={cn(
            "relative bg-background border border-primary/50 hover:border-primary text-foreground font-semibold transition-all duration-300",
            "hover:bg-primary/10 hover:shadow-glow",
            variant === "play" && "bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6",
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