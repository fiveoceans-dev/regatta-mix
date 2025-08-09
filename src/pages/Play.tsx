import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Trophy, Users, Clock, MapPin, Play as PlayIcon, Wind, Waves, Calendar } from "lucide-react"
import { SailingScene } from "@/components/game/sailing-scene"

const mockRegattas = [
  {
    id: 1,
    name: "America's Cup Qualifier",
    class: "AC75",
    players: 24,
    maxPlayers: 32,
    startTime: "14:30",
    location: "Bermuda",
    prizePool: "50,000",
    courseType: "Windward/Leeward"
  },
  {
    id: 2,
    name: "Mediterranean Series",
    class: "TP52",
    players: 18,
    maxPlayers: 20,
    startTime: "15:00",
    location: "Monaco",
    prizePool: "25,000",
    courseType: "Around the Island"
  },
  {
    id: 3,
    name: "Coastal Championship",
    class: "J70",
    players: 32,
    maxPlayers: 32,
    startTime: "16:30",
    location: "San Francisco",
    prizePool: "15,000",
    courseType: "Coastal"
  },
  {
    id: 4,
    name: "Laser World Championship",
    class: "Laser",
    players: 45,
    maxPlayers: 50,
    startTime: "17:00",
    location: "Auckland",
    prizePool: "75,000",
    courseType: "Olympic Triangle"
  },
  {
    id: 5,
    name: "J24 Classic",
    class: "J24",
    players: 16,
    maxPlayers: 24,
    startTime: "18:00",
    location: "Newport",
    prizePool: "12,000",
    courseType: "Pursuit Race"
  }
]

export default function Play() {
  const [countdown, setCountdown] = useState("2:30:45")

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

  return (
    <div className="relative h-screen overflow-hidden pt-16">
      {/* Game Background */}
      <div className="absolute inset-0 z-0">
        <SailingScene />
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="container py-8 space-y-6">
          {/* Quick Match Section */}
          <Card className="bg-background/80 backdrop-blur-md border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <PlayIcon className="h-5 w-5" />
                  Quick Match
                </CardTitle>
                <Button size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Register
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Start In</div>
                  <div className="text-lg font-bold">{countdown}</div>
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
                <CardTitle>All Regattas</CardTitle>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-background/50">
                    <TabsTrigger value="all">All Regattas</TabsTrigger>
                    <TabsTrigger value="my">My Regattas</TabsTrigger>
                    <TabsTrigger value="top">Top Regattas</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsContent value="all" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Regatta</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Register</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRegattas.map((regatta) => (
                        <TableRow key={regatta.id}>
                          <TableCell className="font-medium">{regatta.name}</TableCell>
                          <TableCell>{regatta.class}</TableCell>
                          <TableCell>{regatta.players}/{regatta.maxPlayers}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {regatta.startTime}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {regatta.location}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{regatta.prizePool} pts</TableCell>
                          <TableCell>
                            {regatta.players >= regatta.maxPlayers ? (
                              <Button size="sm" disabled variant="secondary">
                                Closed
                              </Button>
                            ) : (
                              <Button size="sm" className="gap-1">
                                <PlayIcon className="h-3 w-3" />
                                Join
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="my" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Regatta</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Register</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRegattas.slice(0, 2).map((regatta) => (
                        <TableRow key={regatta.id}>
                          <TableCell className="font-medium">{regatta.name}</TableCell>
                          <TableCell>{regatta.class}</TableCell>
                          <TableCell>{regatta.players}/{regatta.maxPlayers}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {regatta.startTime}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {regatta.location}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{regatta.prizePool} pts</TableCell>
                          <TableCell>
                            <Badge variant="default">Registered</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="top" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Regatta</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Prize Pool</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Register</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRegattas.slice(0, 3).map((regatta, index) => (
                        <TableRow key={regatta.id}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-accent" />
                              #{index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{regatta.name}</TableCell>
                          <TableCell>{regatta.class}</TableCell>
                          <TableCell className="font-medium text-accent">{regatta.prizePool} pts</TableCell>
                          <TableCell>{regatta.players}/{regatta.maxPlayers}</TableCell>
                          <TableCell>
                            {regatta.players >= regatta.maxPlayers ? (
                              <Button size="sm" disabled variant="secondary">
                                Closed
                              </Button>
                            ) : (
                              <Button size="sm" className="gap-1">
                                <PlayIcon className="h-3 w-3" />
                                Join
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}