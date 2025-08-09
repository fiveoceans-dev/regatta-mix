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
import { MessageSquare, Clock, User, AlertTriangle, Plus } from "lucide-react"

const mockProtests = [
  {
    id: 1,
    title: "Rule 11 - Windward boat failed to keep clear",
    race: "America's Cup Q1",
    reporter: "Sailor_Mike",
    status: "Under Review",
    time: "2h ago",
    incident: "Turn 3, Mark 2",
    responses: 5
  },
  {
    id: 2,
    title: "Illegal mark rounding at Gate 1",
    race: "Mediterranean Series",
    reporter: "WindHunter",
    status: "Resolved",
    time: "4h ago",
    incident: "Gate 1",
    responses: 12
  },
  {
    id: 3,
    title: "Collision during start sequence",
    race: "Coastal Championship",
    reporter: "SeaWolf",
    status: "Pending",
    time: "6h ago",
    incident: "Start Line",
    responses: 3
  }
]

const myProtests = mockProtests.filter(p => p.reporter === "Sailor_Mike")
const allProtests = mockProtests

export default function ProtestRoom() {
  const [activeTab, setActiveTab] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "default"
      case "Resolved": return "secondary"
      case "Pending": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Protest Room</h1>
          <p className="text-muted-foreground">Report and discuss racing incidents and rule violations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          File Protest
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Protests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently under review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">New protests filed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Within 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Protests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Filed by you</p>
          </CardContent>
        </Card>
      </div>

      {/* Protests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Protests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Protests</TabsTrigger>
              <TabsTrigger value="my">My Protests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protest</TableHead>
                    <TableHead>Race</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Incident</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProtests.map((protest) => (
                    <TableRow key={protest.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{protest.title}</div>
                      </TableCell>
                      <TableCell>{protest.race}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {protest.reporter}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(protest.status)}>
                          {protest.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{protest.incident}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {protest.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {protest.responses}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="my" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Protest</TableHead>
                    <TableHead>Race</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Incident</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myProtests.map((protest) => (
                    <TableRow key={protest.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{protest.title}</div>
                      </TableCell>
                      <TableCell>{protest.race}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(protest.status)}>
                          {protest.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{protest.incident}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {protest.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {protest.responses}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Edit
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
  )
}