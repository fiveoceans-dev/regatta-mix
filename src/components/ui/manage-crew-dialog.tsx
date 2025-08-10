import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SimpleButton } from "@/components/ui/simple-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface ManageCrewDialogProps {
  crewData: {
    id: number
    name: string
    role: string
    rating: number
    experience: string
    status: string
  }
}

export function ManageCrewDialog({ crewData }: ManageCrewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SimpleButton size="sm">
          Manage
        </SimpleButton>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Crew Member Management - {crewData.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="crew-name">Name</Label>
              <Input id="crew-name" defaultValue={crewData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crew-role">Role</Label>
              <Select defaultValue={crewData.role.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skipper">Skipper</SelectItem>
                  <SelectItem value="tactician">Tactician</SelectItem>
                  <SelectItem value="trimmer">Trimmer</SelectItem>
                  <SelectItem value="bowman">Bowman</SelectItem>
                  <SelectItem value="navigator">Navigator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance & Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{crewData.rating}</Badge>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <div className="text-sm font-medium">{crewData.experience}</div>
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge variant={crewData.status === "Active" ? "default" : "secondary"}>
                  {crewData.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to boat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wind-dancer">Wind Dancer J70</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contract Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contract-length">Contract Length</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="race">Single Race</SelectItem>
                    <SelectItem value="regatta">Full Regatta</SelectItem>
                    <SelectItem value="season">Full Season</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary per Race</Label>
                <Input id="salary" placeholder="5000" type="number" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">Release</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}