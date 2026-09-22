import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sun, Moon, LogOut, LogIn } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Play", href: "/play" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Protest Room", href: "/protestroom" },
  { name: "Account", href: "/Account" },
  { name: "Settings", href: "/settings" },
]

export function Navbar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out successfully")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="SailingNet" className="h-8 w-8" />
          <Link to="/" className="font-sans text-xl font-bold uppercase tracking-[0.12em] text-primary">
            SailingNet
          </Link>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-8 w-8"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            {/* Login/Account Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email?.split('@')[0]}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
