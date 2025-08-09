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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Racing Ready": return "default"
      case "Installed": return "default"
      default: return "outline"
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
            <CardTitle className="text-sm font-medium">Available Boats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBoats.length}</div>
            <p className="text-xs text-muted-foreground">New listings this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crew Members</CardTitle>
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
                        <Badge variant={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
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
                        <Badge variant={getConditionColor(boat.condition)}>
                          {boat.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>{boat.performance}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(boat.status)}>
                          {boat.status}
                        </Badge>
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
                        <Badge variant={getConditionColor(part.condition)}>
                          {part.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>{part.performance}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(part.status)}>
                          {part.status}
                        </Badge>
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
          <Tabs defaultValue="boats" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="boats">
                Boats
              </TabsTrigger>
              <TabsTrigger value="crew">
                Crew
              </TabsTrigger>
              <TabsTrigger value="parts">
                Parts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="boats" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Boats</CardTitle>
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
                            <Badge variant={getConditionColor(boat.condition)}>
                              {boat.condition}
                            </Badge>
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
                  
                  {getTotalPages(mockBoats.length) > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              boats: Math.max(1, prev.boats - 1)
                            }))}
                            className={currentPage.boats === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(getTotalPages(mockBoats.length))].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(prev => ({ ...prev, boats: i + 1 }))}
                              isActive={currentPage.boats === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              boats: Math.min(getTotalPages(mockBoats.length), prev.boats + 1)
                            }))}
                            className={currentPage.boats === getTotalPages(mockBoats.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crew" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Crew</CardTitle>
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
                            <Badge variant={getAvailabilityColor(member.availability)}>
                              {member.availability}
                            </Badge>
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
                  
                  {getTotalPages(mockCrew.length) > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              crew: Math.max(1, prev.crew - 1)
                            }))}
                            className={currentPage.crew === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(getTotalPages(mockCrew.length))].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(prev => ({ ...prev, crew: i + 1 }))}
                              isActive={currentPage.crew === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              crew: Math.min(getTotalPages(mockCrew.length), prev.crew + 1)
                            }))}
                            className={currentPage.crew === getTotalPages(mockCrew.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Parts</CardTitle>
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
                            <Badge variant={getConditionColor(part.condition)}>
                              {part.condition}
                            </Badge>
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
                  
                  {getTotalPages(mockParts.length) > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              parts: Math.max(1, prev.parts - 1)
                            }))}
                            className={currentPage.parts === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(getTotalPages(mockParts.length))].map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(prev => ({ ...prev, parts: i + 1 }))}
                              isActive={currentPage.parts === i + 1}
                              className="cursor-pointer"
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(prev => ({
                              ...prev,
                              parts: Math.min(getTotalPages(mockParts.length), prev.parts + 1)
                            }))}
                            className={currentPage.parts === getTotalPages(mockParts.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}