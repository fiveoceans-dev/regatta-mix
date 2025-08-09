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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useState } from "react"

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

const mockParts = [
  {
    id: 1,
    name: "Carbon Fiber Mainsail",
    category: "Sails",
    price: 15000,
    rating: 4.9,
    performance: 95,
    durability: 88,
    weight: "Light",
    compatibility: "AC75, TP52",
    seller: "North Sails",
    condition: "New"
  },
  {
    id: 2,
    name: "Titanium Winch Set",
    category: "Hardware",
    price: 8500,
    rating: 4.7,
    performance: 92,
    durability: 95,
    weight: "Medium",
    compatibility: "All Classes",
    seller: "Harken Racing",
    condition: "New"
  },
  {
    id: 3,
    name: "GPS Navigation System",
    category: "Electronics",
    price: 3200,
    rating: 4.8,
    performance: 90,
    durability: 85,
    weight: "Light",
    compatibility: "Universal",
    seller: "B&G Marine",
    condition: "Used"
  },
  {
    id: 4,
    name: "Carbon Boom",
    category: "Rigging",
    price: 12000,
    rating: 4.6,
    performance: 88,
    durability: 92,
    weight: "Light",
    compatibility: "J70, Laser",
    seller: "Selden Mast",
    condition: "Refurbished"
  }
]

// Mock user's team data
const myTeam = {
  boats: [
    {
      id: 1,
      name: "My Wind Dancer J70",
      class: "J70",
      condition: "New",
      performance: 85,
      status: "Racing Ready"
    }
  ],
  crew: [
    {
      id: 1,
      name: "Captain Sarah Mitchell",
      role: "Skipper",
      rating: 4.9,
      experience: "15 years",
      status: "Active"
    },
    {
      id: 2,
      name: "Jake Rodriguez",
      role: "Tactician",
      rating: 4.7,
      experience: "8 years",
      status: "Active"
    }
  ],
  parts: [
    {
      id: 1,
      name: "Carbon Fiber Mainsail",
      category: "Sails",
      condition: "New",
      performance: 95,
      status: "Installed"
    },
    {
      id: 2,
      name: "GPS Navigation System",
      category: "Electronics",
      condition: "Used",
      performance: 90,
      status: "Installed"
    }
  ]
}

export default function Marketplace() {
  const [currentPage, setCurrentPage] = useState({
    boats: 1,
    crew: 1,
    parts: 1
  })
  
  const itemsPerPage = 10
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "New": return "text-secondary"
      case "Good": return "text-primary"
      case "Fair": return "text-muted-foreground"
      case "Excellent": return "text-secondary"
      case "Refurbished": return "text-primary"
      case "Used": return "text-muted-foreground"
      default: return "text-muted-foreground"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available": return "text-secondary"
      case "Busy": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-secondary"
      case "Racing Ready": return "text-secondary"
      case "Installed": return "text-secondary"
      case "Available": return "text-primary"
      default: return "text-muted-foreground"
    }
  }

  const paginateData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (dataLength: number) => {
    return Math.ceil(dataLength / itemsPerPage)
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
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Boats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBoats.length}</div>
            <p className="text-xs text-muted-foreground">New listings this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCrew.filter(c => c.availability === "Available").length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">487,500</div>
            <p className="text-xs text-muted-foreground">Available for purchases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-team">
            My Team
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            Marketplace
          </TabsTrigger>
        </TabsList>

        {/* My Team Tab */}
        <TabsContent value="my-team" className="space-y-6">
          {/* Crew Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Crew</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTeam.crew.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.rating}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <SimpleButton size="sm">
                          Manage
                        </SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Boats Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Boats</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTeam.boats.map((boat) => (
                    <TableRow key={boat.id}>
                      <TableCell className="font-medium">{boat.name}</TableCell>
                      <TableCell>{boat.class}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConditionColor(boat.condition)}`}>
                          {boat.condition}
                        </span>
                      </TableCell>
                      <TableCell>{boat.performance}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(boat.status)}`}>
                          {boat.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <SimpleButton size="sm">
                          Manage
                        </SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Parts Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Parts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTeam.parts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>{part.category}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConditionColor(part.condition)}`}>
                          {part.condition}
                        </span>
                      </TableCell>
                      <TableCell>{part.performance}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(part.status)}`}>
                          {part.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <SimpleButton size="sm">
                          Manage
                        </SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          {/* Boats Section */}
          <Card>
            <CardHeader>
              <CardTitle>Boats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  {paginateData(mockBoats, currentPage.boats).map((boat) => (
                    <TableRow key={boat.id}>
                      <TableCell className="font-medium">{boat.name}</TableCell>
                      <TableCell>{boat.class}</TableCell>
                      <TableCell className="font-medium">
                        {boat.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {boat.rating}
                      </TableCell>
                      <TableCell>{boat.speed}</TableCell>
                      <TableCell>{boat.handling}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConditionColor(boat.condition)}`}>
                          {boat.condition}
                        </span>
                      </TableCell>
                      <TableCell>{boat.seller}</TableCell>
                      <TableCell>
                        <SimpleButton size="sm">
                          Buy
                        </SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Crew Section */}
          <Card>
            <CardHeader>
              <CardTitle>Crew</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  {paginateData(mockCrew, currentPage.crew).map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="font-medium">
                        {member.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {member.rating}
                      </TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>{member.specialty}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getAvailabilityColor(member.availability)}`}>
                          {member.availability}
                        </span>
                      </TableCell>
                      <TableCell>
                        {member.availability === "Available" ? (
                          <SimpleButton size="sm">
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

          {/* Parts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Parts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateData(mockParts, currentPage.parts).map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>{part.category}</TableCell>
                      <TableCell className="font-medium">
                        {part.price.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {part.rating}
                      </TableCell>
                      <TableCell>{part.performance}</TableCell>
                      <TableCell>{part.weight}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getConditionColor(part.condition)}`}>
                          {part.condition}
                        </span>
                      </TableCell>
                      <TableCell>{part.seller}</TableCell>
                      <TableCell>
                        <SimpleButton size="sm">
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
      </Tabs>
    </div>
  )
}