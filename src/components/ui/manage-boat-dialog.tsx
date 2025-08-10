import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SimpleButton } from "@/components/ui/simple-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sailboat } from "lucide-react"

interface ManageBoatDialogProps {
  boatData: {
    id: number
    name: string
    class: string
    condition: string
    performance: number
    status: string
  }
}

export function ManageBoatDialog({ boatData }: ManageBoatDialogProps) {
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
            <Sailboat className="h-5 w-5" />
            Boat Configuration - {boatData.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="boat-name">Boat Name</Label>
              <Input id="boat-name" defaultValue={boatData.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="boat-class">Boat Class</Label>
              <Select defaultValue={boatData.class.toLowerCase()}>
                <SelectTrigger>
                  <SelectValue placeholder="Select boat class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ac75">AC75</SelectItem>
                  <SelectItem value="imoca">IMOCA 60</SelectItem>
                  <SelectItem value="tp52">TP52</SelectItem>
                  <SelectItem value="j70">J/70</SelectItem>
                  <SelectItem value="laser">Laser</SelectItem>
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

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Performance:</span>
                <span className="font-medium">{boatData.performance}</span>
              </div>
              <div className="flex justify-between">
                <span>Condition:</span>
                <span className="font-medium">{boatData.condition}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">{boatData.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-24 w-40 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Boat Preview</span>
            </div>
            <Button>Save Configuration</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}