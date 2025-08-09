import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/ui/auth-dialog"
import { Anchor, Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Play", href: "/play" },
  { name: "Protest Room", href: "/protestroom" },
  { name: "History", href: "/history" },
  { name: "Settings", href: "/settings" },
]

export function Navbar() {
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // TODO: Replace with actual auth state
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-2">
          <Anchor className="h-6 w-6 text-primary" />
          <Link to="/" className="font-serif-renaissance text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Cyber Sailing
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
            {isLoggedIn ? (
              <Button variant="outline" size="sm">
                Account
              </Button>
            ) : (
              <AuthDialog onSuccess={() => setIsLoggedIn(true)}>
                <Button variant="default" size="sm">
                  Login
                </Button>
              </AuthDialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}