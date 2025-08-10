import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SimpleButton } from "@/components/ui/simple-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"

interface ManagePartsDialogProps {
  partData: {
    id: number
    name: string
    category: string
    condition: string
    performance: number
    status: string
  }
}

export function ManagePartsDialog({ partData }: ManagePartsDialogProps) {
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
            <Settings className="h-5 w-5" />
            Parts Management - {partData.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="part-name">Part Name</Label>
              <Input id="part-name" defaultValue={partData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="part-category">Category</Label>
              <Select defaultValue={partData.category.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sails">Sails</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="rigging">Rigging</SelectItem>
                  <SelectItem value="deck">Deck Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Part Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Performance Rating</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{partData.performance}</Badge>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Badge variant={partData.condition === "New" ? "default" : "secondary"}>
                  {partData.condition}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Badge variant={partData.status === "Installed" ? "default" : "secondary"}>
                  {partData.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label htmlFor="installation">Installation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Install on boat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wind-dancer">Wind Dancer J70</SelectItem>
                    <SelectItem value="storage">In Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Maintenance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="last-service">Last Service Date</Label>
                <Input id="last-service" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="next-service">Next Service Due</Label>
                <Input id="next-service" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-notes">Service Notes</Label>
                <Input id="service-notes" placeholder="Add maintenance notes..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warranty status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="na">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline">Remove</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}