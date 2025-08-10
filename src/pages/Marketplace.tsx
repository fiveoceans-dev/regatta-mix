import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SimpleButton } from "@/components/ui/simple-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ManageBoatDialog } from "@/components/ui/manage-boat-dialog"
import { ManageCrewDialog } from "@/components/ui/manage-crew-dialog"
import { ManagePartsDialog } from "@/components/ui/manage-parts-dialog"
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

export default function Marketplace() {
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState({
    boats: 1,
    crew: 1,
    parts: 1
  })
  const [boats, setBoats] = useState<any[]>([])
  const [crew, setCrew] = useState<any[]>([])
  const [parts, setParts] = useState<any[]>([])
  const [myBoats, setMyBoats] = useState<any[]>([])
  const [myCrew, setMyCrew] = useState<any[]>([])
  const [myParts, setMyParts] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const itemsPerPage = 10

  useEffect(() => {
    if (user) {
      fetchMarketplaceData()
      fetchMyItems()
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchMarketplaceData = async () => {
    try {
      const [boatsRes, crewRes, partsRes] = await Promise.all([
        supabase.from('boats').select('*').is('owner_id', null).order('created_at', { ascending: false }),
        supabase.from('crew').select('*').eq('status', 'available').order('created_at', { ascending: false }),
        supabase.from('parts').select('*').is('owner_id', null).order('created_at', { ascending: false })
      ])

      setBoats(boatsRes.data || [])
      setCrew(crewRes.data || [])
      setParts(partsRes.data || [])
    } catch (error) {
      console.error('Error fetching marketplace data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyItems = async () => {
    try {
      const [boatsRes, crewRes, partsRes] = await Promise.all([
        supabase.from('boats').select('*').eq('owner_id', user?.id),
        supabase.from('crew').select('*').eq('owner_id', user?.id),
        supabase.from('parts').select('*').eq('owner_id', user?.id)
      ])

      setMyBoats(boatsRes.data || [])
      setMyCrew(crewRes.data || [])
      setMyParts(partsRes.data || [])
    } catch (error) {
      console.error('Error fetching my items:', error)
    }
  }
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "text-secondary"
      case "good": return "text-primary"
      case "fair": return "text-muted-foreground"
      case "excellent": return "text-secondary"
      default: return "text-muted-foreground"
    }
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available": return "text-secondary"
      case "busy": return "text-destructive"
      case "contracted": return "text-muted-foreground"
      default: return "text-muted-foreground"
    }
  }

  const paginateData = <T,>(data: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return data.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (dataLength: number) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  if (loading) {
    return (
      <div className="container py-8 space-y-8 pt-20">
        <div className="text-center py-8">Loading marketplace...</div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
        <p className="text-muted-foreground">Buy and sell boats, hire crew members, and upgrade your sailing equipment</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Boats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boats.length}</div>
            <p className="text-xs text-muted-foreground">Available for purchase</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crew</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crew.filter(c => c.status === "available").length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.credits || 0}</div>
            <p className="text-xs text-muted-foreground">Available for purchases</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parts.length}</div>
            <p className="text-xs text-muted-foreground">Available parts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-team" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-team">
            My Team
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            Marketplace
          </TabsTrigger>
        </TabsList>

        {/* My Team Tab */}
        <TabsContent value="my-team" className="space-y-6">
          {/* Crew Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Crew</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myCrew.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No crew members yet. Hire some from the marketplace!
                      </TableCell>
                    </TableRow>
                  ) : (
                    myCrew.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.rating}</TableCell>
                        <TableCell>{member.experience} years</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getAvailabilityColor(member.status)}`}>
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ManageCrewDialog crewData={member} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Boats Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Boats</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBoats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No boats yet. Buy some from the marketplace!
                      </TableCell>
                    </TableRow>
                  ) : (
                    myBoats.map((boat) => (
                      <TableRow key={boat.id}>
                        <TableCell className="font-medium">{boat.name}</TableCell>
                        <TableCell>{boat.class}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getConditionColor(boat.condition)}`}>
                            {boat.condition}
                          </span>
                        </TableCell>
                        <TableCell>{boat.rating}</TableCell>
                        <TableCell>{boat.speed}</TableCell>
                        <TableCell>
                          <ManageBoatDialog boatData={boat} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Parts Section */}
          <Card>
            <CardHeader>
              <CardTitle>My Parts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myParts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No parts yet. Buy some from the marketplace!
                      </TableCell>
                    </TableRow>
                  ) : (
                    myParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>{part.category}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getConditionColor(part.condition)}`}>
                            {part.condition}
                          </span>
                        </TableCell>
                        <TableCell>{part.performance}</TableCell>
                        <TableCell>{part.rating}</TableCell>
                        <TableCell>
                          <ManagePartsDialog partData={part} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">

          {/* Boats Section */}
          <Card>
            <CardHeader>
              <CardTitle>Boats for Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Speed</TableHead>
                    <TableHead>Handling</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No boats available for purchase.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginateData(boats, currentPage.boats).map((boat) => (
                      <TableRow key={boat.id}>
                        <TableCell className="font-medium">{boat.name}</TableCell>
                        <TableCell>{boat.class}</TableCell>
                        <TableCell>{boat.price?.toLocaleString()} credits</TableCell>
                        <TableCell>{boat.rating}</TableCell>
                        <TableCell>{boat.speed}</TableCell>
                        <TableCell>{boat.handling}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getConditionColor(boat.condition)}`}>
                            {boat.condition}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" disabled={!profile || profile.credits < boat.price}>
                            Buy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {boats.length > itemsPerPage && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => ({ ...prev, boats: Math.max(1, prev.boats - 1) }))}
                        className={currentPage.boats === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(boats.length) }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(prev => ({ ...prev, boats: i + 1 }))}
                          isActive={currentPage.boats === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => ({ ...prev, boats: Math.min(getTotalPages(boats.length), prev.boats + 1) }))}
                        className={currentPage.boats === getTotalPages(boats.length) ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>

          {/* Crew Section */}
          <Card>
            <CardHeader>
              <CardTitle>Available Crew</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {crew.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No crew members available for hire.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginateData(crew, currentPage.crew).map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.salary?.toLocaleString()} credits</TableCell>
                        <TableCell>{member.rating}</TableCell>
                        <TableCell>{member.experience} years</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getAvailabilityColor(member.status)}`}>
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" disabled={!profile || profile.credits < member.salary}>
                            Hire
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {crew.length > itemsPerPage && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => ({ ...prev, crew: Math.max(1, prev.crew - 1) }))}
                        className={currentPage.crew === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(crew.length) }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(prev => ({ ...prev, crew: i + 1 }))}
                          isActive={currentPage.crew === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => ({ ...prev, crew: Math.min(getTotalPages(crew.length), prev.crew + 1) }))}
                        className={currentPage.crew === getTotalPages(crew.length) ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>

          {/* Parts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Parts for Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Compatibility</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No parts available for purchase.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginateData(parts, currentPage.parts).map((part) => (
                      <TableRow key={part.id}>
                        <TableCell className="font-medium">{part.name}</TableCell>
                        <TableCell>{part.category}</TableCell>
                        <TableCell>{part.price?.toLocaleString()} credits</TableCell>
                        <TableCell>{part.rating}</TableCell>
                        <TableCell>{part.performance}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${getConditionColor(part.condition)}`}>
                            {part.condition}
                          </span>
                        </TableCell>
                        <TableCell>{part.compatible_classes?.join(', ') || 'Universal'}</TableCell>
                        <TableCell>
                          <Button size="sm" disabled={!profile || profile.credits < part.price}>
                            Buy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {parts.length > itemsPerPage && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => ({ ...prev, parts: Math.max(1, prev.parts - 1) }))}
                        className={currentPage.parts === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(parts.length) }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          onClick={() => setCurrentPage(prev => ({ ...prev, parts: i + 1 }))}
                          isActive={currentPage.parts === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => ({ ...prev, parts: Math.min(getTotalPages(parts.length), prev.parts + 1) }))}
                        className={currentPage.parts === getTotalPages(parts.length) ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}