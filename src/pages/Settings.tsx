import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Sailboat, Settings as SettingsIcon, Volume2, Monitor, Globe } from "lucide-react"

export default function Settings() {
  return (
    <div className="container py-8 space-y-8 pt-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile, boat configuration, and game preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <Button variant="outline">Upload Avatar</Button>
              <p className="text-sm text-muted-foreground">JPG, PNG up to 2MB</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Sailor_Mike" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="mike@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">EST</SelectItem>
                  <SelectItem value="pst">PST</SelectItem>
                  <SelectItem value="cet">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Boat Section */}
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
            <Button>Save Configuration</Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Game Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="master-volume">Master Volume</Label>
                <div className="w-32">
                  <Input id="master-volume" type="range" min="0" max="100" defaultValue="80" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sfx-volume">Sound Effects</Label>
                <Switch id="sfx-volume" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="music-volume">Background Music</Label>
                <Switch id="music-volume" defaultChecked />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="graphics-quality">Graphics Quality</Label>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="High" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fps-counter">Show FPS Counter</Label>
                <Switch id="fps-counter" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="wind-arrows">Wind Direction Arrows</Label>
                <Switch id="wind-arrows" defaultChecked />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Multiplayer
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-join">Auto-join Available Races</Label>
                <Switch id="auto-join" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="chat-enabled">Enable Chat</Label>
                <Switch id="chat-enabled" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-chat">Voice Chat</Label>
                <Switch id="voice-chat" />
              </div>
            </div>
          </div>
          
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}