import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, LogIn } from "lucide-react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Play", href: "/play" },
  { name: "Protest Room", href: "/protestroom" },
  { name: "History", href: "/history" },
  { name: "Settings", href: "/settings" },
]

export function Navbar() {
  const location = useLocation()
  const isLoggedIn = false // TODO: Replace with actual auth state

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted rounded"></div> {/* Logo placeholder */}
          <Link to="/" className="font-serif-renaissance text-xl font-semibold text-foreground">
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
          
          {/* Auth Button */}
          <Button variant="outline" size="sm" className="gap-2">
            {isLoggedIn ? (
              <>
                <User className="h-4 w-4" />
                Account
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </nav>
  )
}