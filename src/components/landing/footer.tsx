import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Anchor, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Flag,
  Cloud,
  Trophy,
  Book
} from "lucide-react"

const resourceLinks = {
  "Sailing Rules": [
    { name: "Racing Rules of Sailing", url: "#" },
    { name: "Class Rules", url: "#" },
    { name: "Equipment Regulations", url: "#" },
    { name: "Anti-Doping Code", url: "#" },
    { name: "Protest Procedures", url: "#" }
  ],
  "Flag Signals": [
    { name: "International Code Flags", url: "#" },
    { name: "Racing Signals", url: "#" },
    { name: "Flag Meanings", url: "#" },
    { name: "Signal Procedures", url: "#" },
    { name: "Visual Guide", url: "#" }
  ],
  "Weather & Conditions": [
    { name: "Wind Patterns", url: "#" },
    { name: "Tidal Information", url: "#" },
    { name: "Weather Routing", url: "#" },
    { name: "Current Maps", url: "#" },
    { name: "Forecast Tools", url: "#" }
  ],
  "Major Regattas": [
    { name: "Rolex Sydney Hobart", url: "#" },
    { name: "Fastnet Race", url: "#" },
    { name: "America's Cup", url: "#" },
    { name: "Volvo Ocean Race", url: "#" },
    { name: "SailGP Championship", url: "#" }
  ]
}

const company = {
  name: "Cyber Sailing",
  description: "The world's premier cyber sailing simulation platform, bringing the thrill of competitive sailing to players worldwide.",
  contact: {
    email: "contact@cybersailing.com",
    phone: "+1 (555) 123-4567",
    address: "123 Marina Bay, San Francisco, CA 94105"
  }
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-background to-muted/20 border-t border-border/50">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <Anchor className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{company.name}</span>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {company.description}
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>{company.contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>{company.contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{company.contact.address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="icon"
                  className="border-border/50 hover:border-primary hover:bg-primary/10"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Resource Links */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-4 gap-8">
              {Object.entries(resourceLinks).map(([category, links], categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {categoryIndex === 0 && <Book className="h-5 w-5 text-primary" />}
                    {categoryIndex === 1 && <Flag className="h-5 w-5 text-primary" />}
                    {categoryIndex === 2 && <Cloud className="h-5 w-5 text-primary" />}
                    {categoryIndex === 3 && <Trophy className="h-5 w-5 text-primary" />}
                    {category}
                  </h3>
                  
                  <ul className="space-y-2">
                    {links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.url}
                          className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-2xl font-bold">Weekly Newsletter</h3>
            <p className="text-muted-foreground">
              Get the latest news, race schedules, and exclusive content delivered to your inbox
            </p>
            
            <div className="flex gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 bg-muted/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 {company.name}. All rights reserved.
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}