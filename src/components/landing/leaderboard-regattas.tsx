import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Users, Clock } from "lucide-react"

const leaderboardData = [
  { rank: 1, nickname: "WindMaster", points: 2450, lastPlayed: "2h ago", trend: "up" },
  { rank: 2, nickname: "SailShark", points: 2380, lastPlayed: "4h ago", trend: "same" },
  { rank: 3, nickname: "TackTitan", points: 2290, lastPlayed: "1d ago", trend: "down" },
  { rank: 4, nickname: "GybeGuru", points: 2150, lastPlayed: "6h ago", trend: "up" },
  { rank: 5, nickname: "SpeedDemon", points: 2088, lastPlayed: "3h ago", trend: "up" },
  { rank: 6, nickname: "WaveRider", points: 1995, lastPlayed: "8h ago", trend: "same" },
  { rank: 7, nickname: "StormChaser", points: 1890, lastPlayed: "12h ago", trend: "down" },
  { rank: 8, nickname: "TideRunner", points: 1750, lastPlayed: "1d ago", trend: "up" }
]

const regattaData = [
  { name: "America's Cup Qualifier", players: 156, maxPlayers: 200, class: "TP52" },
  { name: "Mediterranean Sprint", players: 89, maxPlayers: 150, class: "J70" },
  { name: "Pacific Championship", players: 134, maxPlayers: 180, class: "Laser" },
  { name: "Baltic Sea Cup", players: 67, maxPlayers: 120, class: "J24" },
  { name: "Caribbean Cruise", players: 200, maxPlayers: 200, class: "TP52" }
]

export function LeaderboardRegattas() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Leaderboard */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card-sailing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-primary" />
                Leaderboard 2025-Q4
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Sailor</TableHead>
                    <TableHead className="text-muted-foreground">Points</TableHead>
                    <TableHead className="text-muted-foreground">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((player) => (
                    <TableRow 
                      key={player.rank}
                      className="border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`
                            ${player.rank === 1 ? "text-yellow-400" : ""}
                            ${player.rank === 2 ? "text-gray-300" : ""}
                            ${player.rank === 3 ? "text-orange-400" : ""}
                          `}>
                            #{player.rank}
                          </span>
                          {player.trend === "up" && <span className="text-sailing-success text-xs">↗</span>}
                          {player.trend === "down" && <span className="text-sailing-danger text-xs">↘</span>}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-left">{player.nickname}</TableCell>
                      <TableCell className="text-primary font-medium">{player.points.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {player.lastPlayed}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Regattas */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-card-sailing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="h-6 w-6 text-primary" />
                Top Regattas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">Regatta</TableHead>
                    <TableHead className="text-muted-foreground">Class</TableHead>
                    <TableHead className="text-muted-foreground">Players</TableHead>
                    <TableHead className="text-muted-foreground">Register</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regattaData.map((regatta, index) => (
                    <TableRow 
                      key={index}
                      className="border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="text-left">
                        <div className="font-semibold">{regatta.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {regatta.class}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-primary font-medium">{regatta.players}/{regatta.maxPlayers}</span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm"
                          disabled={regatta.players >= regatta.maxPlayers}
                          variant={regatta.players >= regatta.maxPlayers ? "secondary" : "default"}
                        >
                          {regatta.players >= regatta.maxPlayers ? "Closed" : "Join"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}