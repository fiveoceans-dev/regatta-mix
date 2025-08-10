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
import { Trophy, Clock, MapPin, Play as PlayIcon, Target, Award, Sailboat } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockHistory = [
  {
    id: 1,
    race: "America's Cup Q1",
    position: 3,
    points: 85,
    time: "45:23",
    date: "2024-01-15",
    location: "Bermuda",
    participants: 24
  },
  {
    id: 2,
    race: "Mediterranean Series R2",
    position: 1,
    points: 100,
    time: "38:17",
    date: "2024-01-14",
    location: "Monaco",
    participants: 18
  },
  {
    id: 3,
    race: "Coastal Championship",
    position: 7,
    points: 65,
    time: "52:45",
    date: "2024-01-13",
    location: "San Francisco",
    participants: 32
  }
]

export default function Account() {
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
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">Top 20% performer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Races</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karma</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Community reputation</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,847</div>
            <p className="text-xs text-muted-foreground">Season total</p>
          </CardContent>
        </Card>
      </div>

      {/* Season Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Season Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Ranking</span>
                <span className="text-2xl font-bold">#42</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full w-[65%]"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Season Start</span>
                <span>65% Complete</span>
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
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="font-medium">First Place</div>
                  <div className="text-sm text-muted-foreground">Mediterranean Series R2</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <Award className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="font-medium">Perfect Start</div>
                  <div className="text-sm text-muted-foreground">5 consecutive clean starts</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <div className="font-medium">Top 10 Streak</div>
                  <div className="text-sm text-muted-foreground">10 races in top 10</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Boat Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sailboat className="h-5 w-5" />
            Boat Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="boat-name">Boat Name</Label>
              <Input id="boat-name" placeholder="Sea Hawk" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boat-class">Boat Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select boat class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ac75">AC75</SelectItem>
                  <SelectItem value="imoca">IMOCA 60</SelectItem>
                  <SelectItem value="tp52">TP52</SelectItem>
                  <SelectItem value="j70">J/70</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sail Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mainsail">Mainsail</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mainsail" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="racing">Racing</SelectItem>
                    <SelectItem value="heavy">Heavy Weather</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jib">Jib</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jib" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="j1">J1</SelectItem>
                    <SelectItem value="j2">J2</SelectItem>
                    <SelectItem value="j3">J3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="spinnaker">Spinnaker</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spinnaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a2">A2</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="a5">A5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-24 w-40 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Boat Preview</span>
            </div>
            <Button>Save</Button>
          </div>
        </CardContent>
      </Card>

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
                <TableHead>Points</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Replay</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((race) => (
                <TableRow key={race.id}>
                  <TableCell className="font-medium">{race.race}</TableCell>
                  <TableCell>
                    <Badge variant={getPositionColor(race.position)}>
                      #{race.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{race.points}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {race.time}
                    </div>
                  </TableCell>
                  <TableCell>{race.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {race.location}
                    </div>
                  </TableCell>
                  <TableCell>{race.participants}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="gap-1">
                      <PlayIcon className="h-3 w-3" />
                      Watch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}