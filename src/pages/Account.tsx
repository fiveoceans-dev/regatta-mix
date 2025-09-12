import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy, Clock, MapPin, Play as PlayIcon, Target, Award, DollarSign } from "lucide-react"
import { BuyCreditsDialog } from "@/components/ui/buy-credits-dialog"
import { useAuth } from "@/hooks/useAuth"
import { useRegattaProfile } from "@/hooks/useRegattaProfile"
import { supabase } from "@/integrations/supabase/client"

const mockHistory = [
  {
    id: 1,
    race: "America's Cup Q1",
    position: 3,
    credits: 85,
    time: "45:23",
    date: "2024-01-15",
    location: "Bermuda",
    participants: 24
  },
  {
    id: 2,
    race: "Mediterranean Series R2",
    position: 1,
    credits: 100,
    time: "38:17",
    date: "2024-01-14",
    location: "Monaco",
    participants: 18
  },
  {
    id: 3,
    race: "Coastal Championship",
    position: 7,
    credits: 65,
    time: "52:45",
    date: "2024-01-13",
    location: "San Francisco",
    participants: 32
  }
]

export default function Account() {
  const { user } = useAuth()
  const { profile: regattaProfile } = useRegattaProfile()
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [raceHistory, setRaceHistory] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchRaceHistory()
      fetchAchievements()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .publicFrom('profiles')
        .select('nickname, email, bio, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchRaceHistory = async () => {
    try {
    const { data: registrations, error: regError } = await supabase.site.from('regatta_registrations')
        .select(`
          *,
          regattas (name, location, start_date)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (regError) throw regError
      setRaceHistory(registrations || [])
    } catch (error) {
      console.error('Error fetching race history:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
    const { data: achievements, error: achieveError } = await supabase.site.from('achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false })
        .limit(3)

      if (achieveError) throw achieveError
      setAchievements(achievements || [])
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const getPositionColor = (position: number) => {
    if (position === 1) return "default"
    if (position <= 3) return "secondary"
    return "outline"
  }

  return (
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Account</h1>
        <p className="text-muted-foreground">View your racing performance, statistics, and race replays</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rank</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regattaProfile?.rank || 'Novice'}</div>
            <p className="text-xs text-muted-foreground">{(regattaProfile?.karma || 0) >= 1000 ? 'Elite' : 'Rising'} sailor</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regattaProfile?.total_races || 0}</div>
            <p className="text-xs text-muted-foreground">Total races completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karma</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regattaProfile?.karma || 0}</div>
            <p className="text-xs text-muted-foreground">Community reputation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regattaProfile?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
            <Button 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => setBuyCreditsOpen(true)}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Buy Credits
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Season Progress and Current Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Season Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Season Progress</span>
                <span className="text-lg font-bold">{Math.round((regattaProfile?.total_races || 0) * 10)}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((regattaProfile?.total_races || 0) * 10, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Season Start</span>
                <span>{regattaProfile?.total_races || 0} races completed</span>
                <span>Season End</span>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No achievements yet. Start racing to earn some!
                </div>
              ) : (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Recent Races */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Races</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Race</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Replay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raceHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No race history yet. Join some regattas to see your progress!
                  </TableCell>
                </TableRow>
              ) : (
                raceHistory.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">{registration.regattas?.name}</TableCell>
                    <TableCell>
                      <Badge variant={getPositionColor(registration.final_position || 0)}>
                        #{registration.final_position || 'TBD'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{registration.prize_money || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        --:--
                      </div>
                    </TableCell>
                    <TableCell>{new Date(registration.registration_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {registration.regattas?.location}
                      </div>
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="gap-1" disabled>
                        <PlayIcon className="h-3 w-3" />
                        Watch
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <BuyCreditsDialog 
        open={buyCreditsOpen} 
        onOpenChange={setBuyCreditsOpen} 
      />
    </div>
  )
}