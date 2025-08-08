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
    platform: "YouTube",
    user: "SailGameOfficial",
    content: "🎥 NEW VIDEO: Top 10 Sailing Tactics That Will Make You Unbeatable! Watch our pro players share their secrets.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop",
    likes: 892,
    comments: 156,
    time: "1d ago"
  },
  {
    id: 3,
    platform: "Twitter",
    user: "SailGameOfficial",
    content: "⚡ Server maintenance complete! New weather system is now live with enhanced wind patterns and tidal effects. Jump in and feel the difference!",
    likes: 543,
    comments: 67,
    time: "3d ago"
  }
]

export function CommunitySection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our <span className="text-primary">Sailing Community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with sailors worldwide, share your victories, and stay updated with the latest news
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Social Links */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
            
            <div className="grid gap-4">
              {socialLinks.map((social) => (
                <Card 
                  key={social.platform}
                  className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow/50 cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors`}>
                          <social.icon className={`h-6 w-6 ${social.color} transition-colors`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{social.platform}</h4>
                          <p className="text-muted-foreground">{social.followers} followers</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="group-hover:border-primary">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-6">Latest Updates</h3>
            
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>SG</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{post.user}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{post.time}</span>
                        </div>
                        
                        <p className="text-sm leading-relaxed">{post.content}</p>
                        
                        {post.image && (
                          <div className="rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post image"
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share className="h-4 w-4" />
                            Share
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