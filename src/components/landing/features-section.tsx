import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Wind, 
  Waves, 
  Trophy, 
  Users, 
  BarChart3, 
  Globe, 
  Timer,
  Zap 
} from "lucide-react"

const features = [
  {
    icon: Wind,
    title: "Real-time Weather",
    description: "Live wind patterns, currents, and weather data for authentic sailing conditions",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop"
  },
  {
    icon: Users,
    title: "Multiplayer Racing",
    description: "Compete with up to 200 players in real-time sailing competitions",
    image: "https://images.unsplash.com/photo-1566053530509-1b4b1cc6c09d?w=400&h=300&fit=crop"
  },
  {
    icon: Trophy,
    title: "Championship Series",
    description: "Join seasonal tournaments and climb the global leaderboards",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Detailed race analysis and performance metrics to improve your skills",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop"
  },
  {
    icon: Globe,
    title: "Global Courses",
    description: "Sail famous courses from around the world with realistic conditions",
    image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=400&h=300&fit=crop"
  },
  {
    icon: Zap,
    title: "Instant Action",
    description: "Quick match system gets you racing within seconds",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
  },
  {
    icon: Timer,
    title: "Race Replays",
    description: "Study your races and learn from the best sailors in detailed replays",
    image: "https://images.unsplash.com/photo-1562182384-08115de5ee97?w=400&h=300&fit=crop"
  },
  {
    icon: Waves,
    title: "Dynamic Conditions",
    description: "Adaptive weather systems that change during races for ultimate challenge",
    image: "https://images.unsplash.com/photo-1470167494176-c2e966a4eb72?w=400&h=300&fit=crop"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Master the Art of <span className="text-primary">Digital Sailing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the most realistic sailing simulation with cutting-edge technology 
            and competitive multiplayer action
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-sailing cursor-pointer"
            >
              <CardContent className="p-6">
                {/* Feature Image/GIF */}
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <feature.icon className="h-8 w-8 text-primary animate-float" />
                  </div>
                </div>

                {/* Feature Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}