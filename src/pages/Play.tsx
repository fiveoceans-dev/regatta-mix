import { useState } from "react"
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
import { Trophy, Users, Clock, MapPin, Play as PlayIcon, Wind, Waves } from "lucide-react"
import { SailingScene } from "@/components/game/sailing-scene"

const mockRegattas = [
  {
    id: 1,
    name: "America's Cup Qualifier",
    status: "Open",
    participants: 24,
    startTime: "14:30",
    location: "Bermuda",
    prizePool: "$50,000",
    difficulty: "Expert"
  },
  {
    id: 2,
    name: "Mediterranean Series",
    status: "Starting Soon",
    participants: 18,
    startTime: "15:00",
    location: "Monaco",
    prizePool: "$25,000",
    difficulty: "Advanced"
  },
  {
    id: 3,
    name: "Coastal Championship",
    status: "Open",
    participants: 32,
    startTime: "16:30",
    location: "San Francisco",
    prizePool: "$15,000",
    difficulty: "Intermediate"
  }
]

export default function Play() {
  return (
    <div className="relative min-h-screen pt-16">
      {/* Game Background */}
      <div className="absolute inset-0 z-0">
        <SailingScene />
      </div>
      
      {/* Overlay Content */}
      <div className="relative z-10 container py-8 space-y-6">
        {/* Quick Match Section */}
        <Card className="bg-background/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <PlayIcon className="h-5 w-5" />
              Quick Match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Next Race</div>
                <div className="text-lg font-bold">2:30 PM</div>
                <div className="text-xs text-muted-foreground">Bermuda Course</div>
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
              <div className="flex items-end">
                <Button size="lg" className="w-full">
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Join Quick Match
                </Button>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRegattas.map((regatta) => (
                      <TableRow key={regatta.id}>
                        <TableCell className="font-medium">{regatta.name}</TableCell>
                        <TableCell>
                          <Badge variant={regatta.status === "Open" ? "default" : "secondary"}>
                            {regatta.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {regatta.participants}
                          </div>
                        </TableCell>
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
                        <TableCell className="font-medium">{regatta.prizePool}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{regatta.difficulty}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1">
                            <PlayIcon className="h-3 w-3" />
                            Join
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="my" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  No regattas joined yet. Join your first regatta above!
                </div>
              </TabsContent>
              
              <TabsContent value="top" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Regatta</TableHead>
                      <TableHead>Prize Pool</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRegattas.slice(0, 2).map((regatta, index) => (
                      <TableRow key={regatta.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-accent" />
                            #{index + 1}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{regatta.name}</TableCell>
                        <TableCell className="font-medium text-accent">{regatta.prizePool}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {regatta.participants}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" className="gap-1">
                            <PlayIcon className="h-3 w-3" />
                            Join
                          </Button>
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
  )
}