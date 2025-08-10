import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Instagram, Youtube, Twitter, ExternalLink, Heart, MessageCircle, Share } from "lucide-react"

const socialLinks = [
  {
    platform: "Instagram",
    icon: Instagram,
    url: "#",
    followers: "45.2K",
    color: "hover:text-pink-500"
  },
  {
    platform: "YouTube",
    icon: Youtube,
    url: "#",
    followers: "127K",
    color: "hover:text-red-500"
  },
  {
    platform: "Twitter",
    icon: Twitter,
    url: "#",
    followers: "89.1K",
    color: "hover:text-blue-400"
  }
]

const recentPosts = [
  {
    id: 1,
    platform: "Instagram",
    user: "SailGameOfficial",
    content: "🏆 Congratulations to @windmaster for winning the Mediterranean Championship! What an incredible final race! #SailingGame #Esports",
    image: "https://images.unsplash.com/photo-1566053530509-1b4b1cc6c09d?w=300&h=200&fit=crop",
    likes: 1247,
    comments: 89,
    time: "2h ago"
  },
  {
    id: 2,
    platform: "Instagram",
    user: "SailGameOfficial",
    content: "New sailing yacht designs are now available! Check out the latest J70 models with enhanced performance.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    likes: 856,
    comments: 42,
    time: "1d ago"
  },
  {
    id: 3,
    platform: "Instagram",
    user: "SailGameOfficial",
    content: "Beautiful sunset racing session! The Mediterranean looks stunning today. Who's joining us? ⛵",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=200&fit=crop",
    likes: 634,
    comments: 28,
    time: "2d ago"
  },
  {
    id: 4,
    platform: "YouTube",
    user: "SailGameOfficial",
    content: "🎥 NEW VIDEO: Top 10 Sailing Tactics That Will Make You Unbeatable! Watch our pro players share their secrets.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    likes: 892,
    comments: 156,
    time: "1d ago"
  },
  {
    id: 5,
    platform: "YouTube",
    user: "SailGameOfficial",
    content: "Live Stream: America's Cup Qualifier finals! Join us for the most exciting racing action of the season.",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=200&fit=crop",
    likes: 1543,
    comments: 267,
    time: "3d ago"
  },
  {
    id: 6,
    platform: "YouTube",
    user: "SailGameOfficial",
    content: "Tutorial: Mastering wind patterns and racing lines. Essential skills for competitive sailing!",
    image: "https://images.unsplash.com/photo-1590859808308-3d2d9d53d021?w=300&h=200&fit=crop",
    likes: 721,
    comments: 91,
    time: "5d ago"
  },
  {
    id: 7,
    platform: "Twitter",
    user: "SailGameOfficial",
    content: "⚡ Server maintenance complete! New weather system is now live with enhanced wind patterns and tidal effects. Jump in and feel the difference!",
    likes: 543,
    comments: 67,
    time: "3d ago"
  },
  {
    id: 8,
    platform: "Twitter",
    user: "SailGameOfficial",
    content: "Big announcement coming this Friday! Stay tuned for something that will change the game forever 🚀",
    likes: 892,
    comments: 134,
    time: "4d ago"
  },
  {
    id: 9,
    platform: "Twitter",
    user: "SailGameOfficial",
    content: "Player spotlight: @SpeedDemon just broke the Pacific Championship record! Incredible performance! 🏆",
    likes: 467,
    comments: 53,
    time: "6d ago"
  }
]

export function CommunitySection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Join Sailing Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with sailors worldwide, share your victories, and stay updated with the latest news
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Instagram Column */}
          <div className="space-y-6">
            <Card className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <Instagram className="h-6 w-6 hover:text-pink-500 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Instagram</h4>
                      <p className="text-muted-foreground">45.2K followers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:border-primary">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {recentPosts.filter(post => post.platform === "Instagram").slice(0, 3).map((post) => (
                <Card 
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>SG</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.user}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        
                        <p className="text-xs leading-relaxed">{post.content}</p>
                        
                        {post.image && (
                          <div className="rounded-sm overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* YouTube Column */}
          <div className="space-y-6">
            <Card className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <Youtube className="h-6 w-6 hover:text-red-500 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">YouTube</h4>
                      <p className="text-muted-foreground">127K followers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:border-primary">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {recentPosts.filter(post => post.platform === "YouTube").slice(0, 3).map((post) => (
                <Card 
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>SG</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.user}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        
                        <p className="text-xs leading-relaxed">{post.content}</p>
                        
                        {post.image && (
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Twitter Column */}
          <div className="space-y-6">
            <Card className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow/50 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                      <Twitter className="h-6 w-6 hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Twitter</h4>
                      <p className="text-muted-foreground">89.1K followers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:border-primary">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {recentPosts.filter(post => post.platform === "Twitter").slice(0, 3).map((post) => (
                <Card 
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>SG</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{post.user}</span>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        
                        <p className="text-xs leading-relaxed">{post.content}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}