import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SimpleButton } from "@/components/ui/simple-button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MessageSquare, Clock, User, AlertTriangle, Plus } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

const mockProtests = [
  {
    id: 1,
    title: "Rule 11 - Windward boat failed to keep clear",
    regatta: "America's Cup Q1",
    class: "AC75",
    reporter: "Sailor_Mike",
    status: "Under Review",
    incident: "Turn 3, Mark 2",
    responses: 5
  },
  {
    id: 2,
    title: "Illegal mark rounding at Gate 1",
    regatta: "Mediterranean Series",
    class: "TP52",
    reporter: "WindHunter",
    status: "Resolved",
    incident: "Gate 1",
    responses: 12
  },
  {
    id: 3,
    title: "Collision during start sequence",
    regatta: "Coastal Championship",
    class: "J70",
    reporter: "SeaWolf",
    status: "Pending",
    incident: "Start Line",
    responses: 3
  },
  {
    id: 4,
    title: "Rule 18 - Mark room violation",
    regatta: "Laser World Championship",
    class: "Laser",
    reporter: "Sailor_Mike",
    status: "Under Review",
    incident: "Mark 4",
    responses: 7
  }
]

const myProtests = mockProtests.filter(p => p.reporter === "Sailor_Mike")
const allProtests = mockProtests

export default function ProtestRoom() {
  const { user } = useAuth()
  const [protests, setProtests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProtests()
    }
  }, [user])

  const fetchProtests = async () => {
    try {
      const { data, error } = await supabase
        .from('protests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProtests(data || [])
    } catch (error) {
      console.error('Error fetching protests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "text-primary"
      case "resolved": return "text-secondary" 
      case "pending": return "text-destructive"
      default: return "text-muted-foreground"
    }
  }

  const myProtests = protests.filter(p => p.protester_id === user?.id)

  return (
    <div className="container py-8 space-y-8 pt-20">
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Protests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{protests.filter(p => p.status === 'submitted').length}</div>
            <p className="text-xs text-muted-foreground">Currently under review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{protests.filter(p => {
              const createdDate = new Date(p.created_at)
              const currentDate = new Date()
              return createdDate.getMonth() === currentDate.getMonth() && 
                     createdDate.getFullYear() === currentDate.getFullYear()
            }).length}</div>
            <p className="text-xs text-muted-foreground">New protests filed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {protests.length > 0 ? Math.round((protests.filter(p => p.status === 'resolved').length / protests.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Resolution rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Protests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProtests.length}</div>
            <p className="text-xs text-muted-foreground">Filed by me</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Protests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{protests.length}</div>
            <p className="text-xs text-muted-foreground">All protests</p>
          </CardContent>
        </Card>
      </div>

      {/* My Protests Section */}
      {myProtests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Protests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protest</TableHead>
                  <TableHead>Regatta</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Incident</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Loading protests...</TableCell>
                  </TableRow>
                ) : myProtests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No protests filed yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  myProtests.map((protest) => (
                    <TableRow key={protest.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{protest.incident_description}</div>
                      </TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getStatusColor(protest.status)}`}>
                          {protest.status}
                        </span>
                      </TableCell>
                      <TableCell>{protest.rule_citation}</TableCell>
                      <TableCell>--</TableCell>
                      <TableCell>
                        <SimpleButton size="sm">Edit</SimpleButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* All Protests Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Protests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protest</TableHead>
                <TableHead>Regatta</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">Loading protests...</TableCell>
                </TableRow>
              ) : protests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No protests filed yet.
                  </TableCell>
                </TableRow>
              ) : (
                protests.map((protest) => (
                  <TableRow key={protest.id}>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate">{protest.incident_description}</div>
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getStatusColor(protest.status)}`}>
                        {protest.status}
                      </span>
                    </TableCell>
                    <TableCell>{protest.rule_citation || '--'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        0
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
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
  )
}