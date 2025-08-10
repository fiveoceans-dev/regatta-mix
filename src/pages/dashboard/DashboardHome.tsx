import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GlowingButton } from "@/components/ui/glowing-button"
import { 
  Trophy, 
  Users, 
  Clock, 
  TrendingUp, 
  Wind, 
  Waves,
  Play,
  Calendar
} from "lucide-react"

export default function DashboardHome() {
  const stats = [
    { title: "Races Won", value: "47", icon: Trophy, change: "+12%" },
    { title: "Total Races", value: "156", icon: Calendar, change: "+8%" },
    { title: "Current Rank", value: "#1", icon: TrendingUp, change: "↑2" },
    { title: "Play Time", value: "89h", icon: Clock, change: "+5h" }
  ]

  const quickActions = [
    { title: "Quick Match", icon: Play, description: "Join a race instantly" },
    { title: "Weather Check", icon: Wind, description: "View current conditions" },
    { title: "Practice Mode", icon: Waves, description: "Improve your skills" }
  ]

  return (
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Sailor. Ready to race?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Races Completed</div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">#42</div>
              <div className="text-sm text-muted-foreground">Global Ranking</div>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold">3,847</div>
              <div className="text-sm text-muted-foreground">Total Credits</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 border border-border rounded-lg">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border border-border rounded-lg">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}