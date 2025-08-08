import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Wind, Compass, Trophy, Users, MapPin, Activity, Flag, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Wind,
    title: "Dynamic Weather System",
    description: "Real-time wind patterns, shifts and weather conditions that affect your racing strategy"
  },
  {
    icon: Compass,
    title: "Advanced Navigation",
    description: "Professional sailing instruments with heading, speed, and course optimization tools"
  },
  {
    icon: Trophy,
    title: "Championship Series",
    description: "Compete in seasonal championships with rankings, points, and prestigious sailing events"
  },
  {
    icon: Users,
    title: "Multiplayer Racing",
    description: "Race against up to 200 sailors in real-time regattas with live leaderboards"
  },
  {
    icon: MapPin,
    title: "World-Class Venues",
    description: "Sail in famous racing locations from America's Cup to Olympic sailing venues"
  },
  {
    icon: Activity,
    title: "Performance Analytics",
    description: "Detailed race analysis, speed curves, and tactical insights to improve your sailing"
  },
  {
    icon: Flag,
    title: "Official Race Rules",
    description: "Authentic sailing rules, protest procedures, and penalty system simulation"
  },
  {
    icon: TrendingUp,
    title: "Skill Progression",
    description: "Advanced training modes and skill challenges to master racing tactics and techniques"
  }
]

export function UpdatedFeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Master the Art of Racing</h2>
          <p className="text-xl text-muted-foreground">
            Experience the most realistic online sailing simulation with professional-grade features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-500 hover:scale-105 hover:shadow-glow/50 overflow-hidden"
            >
              <CardContent className="p-6">
                {/* Shimmer loading placeholder */}
                <div className="relative mb-4 h-48 rounded-lg overflow-hidden bg-muted">
                  <Skeleton className="w-full h-full relative">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent animate-shimmer"
                      style={{
                        backgroundSize: '200% 100%'
                      }}
                    />
                  </Skeleton>
                  
                  {/* Icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <feature.icon className="h-16 w-16 text-primary/60" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}