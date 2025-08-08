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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, WindMaster!</h1>
          <p className="text-muted-foreground">Ready to dominate the seas today?</p>
        </div>
        
        <GlowingButton variant="play" className="animate-pulse">
          <Play className="mr-2 h-5 w-5" />
          Start Racing
        </GlowingButton>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-glow/50 transition-all duration-300 cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Races */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Recent Races
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { race: "Mediterranean Sprint", position: "1st", points: "+150", time: "2h ago" },
              { race: "Atlantic Challenge", position: "3rd", points: "+85", time: "1d ago" },
              { race: "Pacific Cup", position: "1st", points: "+200", time: "2d ago" }
            ].map((race, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium">{race.race}</p>
                  <p className="text-sm text-muted-foreground">{race.time}</p>
                </div>
                <div className="text-right">
                  <Badge variant={race.position === "1st" ? "default" : "secondary"}>
                    {race.position}
                  </Badge>
                  <p className="text-sm text-primary font-medium">{race.points}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Tournaments */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Active Tournaments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "World Championship", status: "Qualified", next: "Finals - Tomorrow" },
              { name: "Regional Cup", status: "Round 2", next: "Next race in 4h" },
              { name: "Weekly Challenge", status: "Leading", next: "Ends in 3d" }
            ].map((tournament, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                <div>
                  <p className="font-medium">{tournament.name}</p>
                  <p className="text-sm text-muted-foreground">{tournament.next}</p>
                </div>
                <Badge variant="outline">{tournament.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}