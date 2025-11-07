import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Users, Clock } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface LeaderboardPlayer {
  rank: number
  nickname: string
  credits: number
  lastPlayed: string
  trend: "up" | "down" | "same"
}

interface TopRegatta {
  id: string
  name: string
  players: number
  maxPlayers: number
  class: string
}

export function LeaderboardRegattas() {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardPlayer[]>([])
  const [regattaData, setRegattaData] = useState<TopRegatta[]>([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)
  const [regattasLoading, setRegattasLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
    fetchTopRegattas()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      // Get regatta profiles with credits
      const { data: regattaProfiles, error } = await supabase
        .from('site_regatta_profiles')
        .select(`
          credits,
          updated_at,
          profiles!inner(nickname)
        `)
        .order('credits', { ascending: false })
        .limit(8)

      if (error) throw error

      const formattedData: LeaderboardPlayer[] = (regattaProfiles || []).map((profile: any, index) => ({
        rank: index + 1,
        nickname: profile?.profiles?.nickname || 'Unknown',
        credits: profile?.credits || 0,
        lastPlayed: formatTimeAgo(profile?.updated_at || new Date().toISOString()),
        trend: Math.random() > 0.5 ? (Math.random() > 0.5 ? "up" : "down") : "same"
      }))

      setLeaderboardData(formattedData)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLeaderboardLoading(false)
    }
  }

  const fetchTopRegattas = async () => {
    try {
      const { data: regattas, error } = await supabase
        .from('regattas')
        .select('id, name, class, current_players, max_players')
        .in('status', ['upcoming', 'registration_open'])
        .order('current_players', { ascending: false })
        .limit(5)

      if (error) throw error

      const formattedData: TopRegatta[] = (regattas || []).map((regatta: any) => ({
        id: regatta?.id || '',
        name: regatta?.name || 'Unknown Regatta',
        players: regatta?.current_players || 0,
        maxPlayers: regatta?.max_players || 0,
        class: (regatta?.class || 'unknown').toUpperCase()
      }))

      setRegattaData(formattedData)
    } catch (error) {
      console.error('Error fetching top regattas:', error)
    } finally {
      setRegattasLoading(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const handleJoinRegatta = async (regattaId: string) => {
    if (!user) {
      // Handle non-authenticated users - could show login dialog
      alert("Please log in to join regattas")
      return
    }

    try {
      const { error } = await supabase
        .from('regatta_registrations')
        .insert({
          regatta_id: regattaId,
          user_id: user.id,
          paid: false
        })

      if (error) throw error
      
      // Refresh regatta data after joining
      fetchTopRegattas()
    } catch (error) {
      console.error('Error joining regatta:', error)
      alert("Failed to join regatta. You may already be registered.")
    }
  }

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
                    <TableHead className="text-muted-foreground">Credits</TableHead>
                    <TableHead className="text-muted-foreground">Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardLoading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                      <TableRow key={index} className="border-border/30">
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    leaderboardData.map((player) => (
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
                        <TableCell className="text-primary font-medium">{player.credits.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {player.lastPlayed}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
                  {regattasLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="border-border/30">
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    regattaData.map((regatta) => (
                      <TableRow 
                        key={regatta.id}
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
                            onClick={() => handleJoinRegatta(regatta.id)}
                          >
                            {regatta.players >= regatta.maxPlayers ? "Closed" : "Join"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}