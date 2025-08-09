import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, Users, Clock, MapPin, Play as PlayIcon } from "lucide-react"

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
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Play</h1>
        <p className="text-muted-foreground">Join available regattas and compete with sailors worldwide</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Regattas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Sailors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
            <p className="text-xs text-muted-foreground">Currently racing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Ranking</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#42</div>
            <p className="text-xs text-muted-foreground">Global leaderboard</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Regattas */}
      <Card>
        <CardHeader>
          <CardTitle>Available Regattas</CardTitle>
        </CardHeader>
        <CardContent>
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
                <TableHead>Boat</TableHead>
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
                    <div className="h-8 w-12 bg-muted rounded"></div>
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
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}