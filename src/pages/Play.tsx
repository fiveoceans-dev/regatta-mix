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
import { Trophy, Users, Clock, MapPin, Play as PlayIcon, Wind, Waves, Calendar, Plus } from "lucide-react"
import { SailingScene } from "@/components/game/sailing-scene"
import { CreateRegattaDialog } from "@/components/ui/create-regatta-dialog"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

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
  const { user } = useAuth()
  const [countdown, setCountdown] = useState("2:30:45")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [regattas, setRegattas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quickMatch, setQuickMatch] = useState<any>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchRegattas()
    fetchQuickMatch()
  }, [activeTab])

  useEffect(() => {
    const timer = setInterval(() => {
      if (quickMatch?.start_date) {
        const now = new Date()
        const startTime = new Date(quickMatch.start_date)
        const diff = startTime.getTime() - now.getTime()
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          
          setCountdown(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
        } else {
          setCountdown("Starting...")
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [quickMatch])

  const fetchRegattas = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('regattas')
        .select(`
          *,
          regatta_registrations (count)
        `)
        .order('start_date', { ascending: true })

      if (activeTab === 'my' && user) {
        query = query.eq('organizer_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error

      setRegattas(data || [])
    } catch (error) {
      console.error('Error fetching regattas:', error)
      toast.error('Failed to load regattas')
    } finally {
      setLoading(false)
    }
  }

  const fetchQuickMatch = async () => {
    try {
      const { data, error } = await supabase
        .from('regattas')
        .select('*')
        .like('name', 'Quick Match%')
        .eq('status', 'upcoming')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      setQuickMatch(data)
    } catch (error) {
      console.error('Error fetching quick match:', error)
    }
  }

  const getDisplayRegattas = () => {
    if (activeTab === 'top') {
      return regattas.filter(r => r.prize_pool >= 2000)
    }
    return regattas
  }

  const currentRegattas = getDisplayRegattas()
  const totalPages = Math.ceil(currentRegattas.length / itemsPerPage)
  const paginatedRegattas = currentRegattas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleJoinRegatta = async (regattaId: string) => {
    if (!user) {
      toast.error('Please sign in to join regattas')
      return
    }

    try {
      const { error } = await supabase
        .from('regatta_registrations')
        .insert({
          regatta_id: regattaId,
          user_id: user.id,
          registration_date: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Successfully joined regatta!')
      fetchRegattas()
    } catch (error) {
      console.error('Error joining regatta:', error)
      toast.error('Failed to join regatta')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
              {quickMatch ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Starts In</div>
                    <div className="text-lg font-bold">{countdown}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="text-lg font-bold">{quickMatch.location}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Class</div>
                    <div className="text-lg font-bold">{quickMatch.class?.toUpperCase()}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Wind</div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4 text-primary" />
                      <span className="text-lg font-bold">{quickMatch.wind_speed || 12} kts</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Conditions</div>
                    <div className="flex items-center gap-1">
                      <Waves className="h-4 w-4 text-primary" />
                      <span className="text-lg font-bold">{quickMatch.wave_height || 2}-{(quickMatch.wave_height || 2) + 1} ft</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{quickMatch.weather_condition}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No quick match available. Next one will be created soon!
                </div>
              )}
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
                <CreateRegattaDialog onSuccess={fetchRegattas}>
                  <SimpleButton>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Regatta
                  </SimpleButton>
                </CreateRegattaDialog>
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          Loading regattas...
                        </TableCell>
                      </TableRow>
                    ) : paginatedRegattas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No regattas found. Create one to get started!
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRegattas.map((regatta) => (
                        <TableRow key={regatta.id}>
                          <TableCell className="font-medium text-left">{regatta.name}</TableCell>
                          <TableCell>{regatta.class?.toUpperCase()}</TableCell>
                          <TableCell>{regatta.current_players}/{regatta.max_players}</TableCell>
                          <TableCell>{formatDate(regatta.start_date)}</TableCell>
                          <TableCell>{formatDate(regatta.start_date)}</TableCell>
                          <TableCell>{regatta.location}</TableCell>
                          <TableCell className="font-medium">{regatta.prize_pool} pts</TableCell>
                          <TableCell>
                            {regatta.current_players >= regatta.max_players ? (
                              <SimpleButton size="sm" disabled variant="secondary">
                                Full
                              </SimpleButton>
                            ) : (
                              <SimpleButton 
                                size="sm" 
                                onClick={() => handleJoinRegatta(regatta.id)}
                              >
                                Join
                              </SimpleButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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