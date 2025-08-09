import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleButton } from "@/components/ui/simple-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Sailboat, Users, Star, ShoppingCart, Coins } from "lucide-react"

const mockBoats = [
  {
    id: 1,
    name: "Storm Chaser AC75",
    class: "AC75",
    price: 250000,
    rating: 4.8,
    speed: 95,
    handling: 88,
    durability: 92,
    seller: "TechSail Designs",
    condition: "New"
  },
  {
    id: 2,
    name: "Ocean Warrior TP52",
    class: "TP52",
    price: 85000,
    rating: 4.6,
    speed: 82,
    handling: 90,
    durability: 85,
    seller: "Maritime Classics",
    condition: "Used"
  },
  {
    id: 3,
    name: "Wind Dancer J70",
    class: "J70",
    price: 35000,
    rating: 4.5,
    speed: 75,
    handling: 88,
    durability: 80,
    seller: "Coastal Boats",
    condition: "New"
  },
  {
    id: 4,
    name: "Lightning Laser",
    class: "Laser",
    price: 15000,
    rating: 4.7,
    speed: 70,
    handling: 95,
    durability: 88,
    seller: "Single Hand Racing",
    condition: "Refurbished"
  }
]

const mockCrew = [
  {
    id: 1,
    name: "Captain Sarah Mitchell",
    role: "Skipper",
    price: 5000,
    rating: 4.9,
    experience: "15 years",
    specialty: "Match Racing",
    skills: {
      tactics: 95,
      navigation: 92,
      leadership: 98
    },
    availability: "Available"
  },
  {
    id: 2,
    name: "Jake Rodriguez",
    role: "Tactician",
    price: 3500,
    rating: 4.7,
    experience: "8 years",
    specialty: "Fleet Racing",
    skills: {
      tactics: 90,
      windReading: 88,
      communication: 85
    },
    availability: "Available"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Trimmer",
    price: 2800,
    rating: 4.6,
    experience: "6 years",
    specialty: "Sail Optimization",
    skills: {
      sailTrim: 92,
      boatSpeed: 88,
      teamwork: 90
    },
    availability: "Busy"
  },
  {
    id: 4,
    name: "Marco Silva",
    role: "Bowman",
    price: 2200,
    rating: 4.8,
    experience: "10 years",
    specialty: "Maneuvers",
    skills: {
      agility: 95,
      deckWork: 92,
      safety: 90
    },
    availability: "Available"
  }
]

export default function Marketplace() {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New": return "default"
      case "Refurbished": return "secondary"
      case "Used": return "outline"
      default: return "outline"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available": return "default"
      case "Busy": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell boats, hire crew members, and upgrade your sailing equipment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Boats</CardTitle>
            <Sailboat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBoats.length}</div>
            <p className="text-xs text-muted-foreground">New listings this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crew Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCrew.filter(c => c.availability === "Available").length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">487,500</div>
            <p className="text-xs text-muted-foreground">Available for purchases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="boats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="boats" className="gap-2">
            <Sailboat className="h-4 w-4" />
            Boats
          </TabsTrigger>
          <TabsTrigger value="crew" className="gap-2">
            <Users className="h-4 w-4" />
            Crew
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Boats</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Boat</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Handling</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBoats.map((boat) => (
                    <TableRow key={boat.id}>
                      <TableCell className="font-medium">{boat.name}</TableCell>
                      <TableCell>{boat.class}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-accent" />
                          {boat.price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          {boat.rating}
                        </div>
                      </TableCell>
                      <TableCell>{boat.speed}</TableCell>
                      <TableCell>{boat.handling}</TableCell>
                      <TableCell>
                        <Badge variant={getConditionColor(boat.condition)}>
                          {boat.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>{boat.seller}</TableCell>
                      <TableCell>
                        <SimpleButton size="sm" className="gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          Buy
                        </SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crew" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Crew</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCrew.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-accent" />
                          {member.price.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          {member.rating}
                        </div>
                      </TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>{member.specialty}</TableCell>
                      <TableCell>
                        <Badge variant={getAvailabilityColor(member.availability)}>
                          {member.availability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.availability === "Available" ? (
                          <SimpleButton size="sm" className="gap-1">
                            <Users className="h-3 w-3" />
                            Hire
                          </SimpleButton>
                        ) : (
                          <SimpleButton size="sm" disabled className="bg-secondary">
                            Unavailable
                          </SimpleButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}