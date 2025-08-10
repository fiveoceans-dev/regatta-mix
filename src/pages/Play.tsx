import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Trophy, Users, Clock, MapPin, Play as PlayIcon, Wind, Waves, Calendar } from "lucide-react"
import { SailingScene } from "@/components/game/sailing-scene"

// Generate 100 regattas for pagination demo
const generateRegattas = () => {
  const baseRegattas = [
    {
      id: 1,
      name: "America's Cup Qualifier",
      class: "AC75",
      players: 24,
      maxPlayers: 32,
      date: "2024-08-15 16:00 GMT",
      startTime: "3d, 2h",
      location: "Bermuda, BM",
      prizePool: "50,000",
      courseType: "Windward/Leeward"
    },
    {
      id: 2,
      name: "Mediterranean Series",
      class: "TP52",
      players: 18,
      maxPlayers: 20,
      date: "2024-08-15 16:00 GMT",
      startTime: "3d, 2h",
      location: "Monaco, MC",
      prizePool: "25,000",
      courseType: "Around the Island"
    },
    {
      id: 3,
      name: "Coastal Championship",
      class: "J70",
      players: 32,
      maxPlayers: 32,
      date: "2024-08-15 16:00 GMT",
      startTime: "3d, 2h",
      location: "San Francisco, US",
      prizePool: "15,000",
      courseType: "Coastal"
    },
    {
      id: 4,
      name: "Laser World Championship",
      class: "Laser",
      players: 45,
      maxPlayers: 50,
      date: "2024-08-15 16:00 GMT",
      startTime: "3d, 2h",
      location: "Auckland, NZ",
      prizePool: "75,000",
      courseType: "Olympic Triangle"
    },
    {
      id: 5,
      name: "J24 Classic",
      class: "J24",
      players: 16,
      maxPlayers: 24,
      date: "2024-08-15 16:00 GMT",
      startTime: "3d, 2h",
      location: "Newport, US",
      prizePool: "12,000",
      courseType: "Pursuit Race"
    }
  ]
  
  // Generate 100 regattas by repeating and modifying the base ones
  const allRegattas = []
  for (let i = 0; i < 100; i++) {
    const baseRegatta = baseRegattas[i % baseRegattas.length]
    allRegattas.push({
      ...baseRegatta,
      id: i + 1,
      name: `${baseRegatta.name} ${Math.floor(i / 5) + 1}`,
      players: Math.floor(Math.random() * baseRegatta.maxPlayers),
    })
  }
  return allRegattas
}

const mockRegattas = generateRegattas()

export default function Play() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState("2:30:45")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const itemsPerPage = 10

  useEffect(() => {
    const timer = setInterval(() => {
      // Simple countdown logic - in real app would calculate from actual start time
      const now = new Date()
      const targetTime = new Date(now.getTime() + 2.5 * 60 * 60 * 1000) // 2.5 hours from now
      const diff = targetTime.getTime() - now.getTime()
      
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      setCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getRegattas = () => {
    switch (activeTab) {
      case "my":
        return mockRegattas.slice(0, 15) // Mock "my regattas"
      case "top":
        return mockRegattas.slice(0, 20) // Mock "top regattas"
      default:
        return mockRegattas
    }
  }

  const currentRegattas = getRegattas()
  const totalPages = Math.ceil(currentRegattas.length / itemsPerPage)
  const paginatedRegattas = currentRegattas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
  }

  return (
    <div className="relative min-h-screen pt-16">
      {/* Game Background */}
      <div className="absolute inset-0 z-0">
        <SailingScene />
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10">
        <div className="container py-8 space-y-6">
          {/* Quick Match Section */}
          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    Quick Match
                  </CardTitle>
                  <SimpleButton size="lg" onClick={() => navigate("/game")}>
                    Join
                  </SimpleButton>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Starts In</div>
                  <div className="text-lg font-bold">{countdown}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="text-lg font-bold">Monaco, MC</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Course Type</div>
                  <div className="text-lg font-bold">Windward/Leeward</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Wind</div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">12 kts</span>
                  </div>
                  <div className="text-xs text-muted-foreground">SW 240°</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Conditions</div>
                  <div className="flex items-center gap-1">
                    <Waves className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">2-3 ft</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Light chop</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Regattas Section */}
          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
                  <TabsList className="bg-background/50">
                    <TabsTrigger value="my">My Regattas</TabsTrigger>
                    <TabsTrigger value="all">All Regattas</TabsTrigger>
                    <TabsTrigger value="top">Top Regattas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Regatta</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Starts In</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Register</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRegattas.map((regatta) => (
                      <TableRow key={regatta.id}>
                        <TableCell className="font-medium">{regatta.name}</TableCell>
                        <TableCell>{regatta.class}</TableCell>
                        <TableCell>{regatta.players}/{regatta.maxPlayers}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {regatta.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {regatta.startTime}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {regatta.location}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{regatta.prizePool} pts</TableCell>
                        <TableCell>
                          {regatta.players >= regatta.maxPlayers ? (
                            <SimpleButton size="sm" disabled variant="secondary">
                              Closed
                            </SimpleButton>
                          ) : (
                            <SimpleButton size="sm" onClick={() => navigate("/game")}>
                              Join
                            </SimpleButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        if (totalPages <= 5) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          )
                        }
                        return null
                      })}
                      
                      {totalPages > 5 && <PaginationEllipsis />}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}