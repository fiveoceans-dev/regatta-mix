import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Settings as SettingsIcon, Volume2, Monitor, Globe } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export default function Settings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchSettings()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data: profile, error } = await supabase.from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setProfile(profile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchSettings = async () => {
    try {
    const { data: settings, error: settingsError } = await supabase.site.from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (settingsError) throw settingsError
      setSettings(settings)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const updateProfile = async () => {
    if (!profile || !user) return

    setLoading(true)
    try {
    const { error } = await supabase.from('profiles')
        .update({
          nickname: profile.nickname,
          country: profile.country,
          timezone: profile.timezone
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async () => {
    if (!settings || !user) return

    setLoading(true)
    try {
    const { error } = await supabase.site.from('user_settings')
        .update(settings)
        .eq('user_id', user.id)

      if (error) throw error
      toast.success('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  if (!profile || !settings) {
    return (
      <div className="container py-8 pt-20">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

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
              <Input 
                id="username" 
                value={profile.nickname || ""} 
                onChange={(e) => setProfile({...profile, nickname: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={profile.country || ""} onValueChange={(value) => setProfile({...profile, country: value})}>
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
              <Select value={profile.timezone || ""} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="CET">CET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={updateProfile} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
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
                <Label htmlFor="sfx-volume">SFX Volume: {settings.sfx_volume}</Label>
                <div className="w-32">
                  <Input 
                    id="sfx-volume" 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={settings.sfx_volume || 75}
                    onChange={(e) => setSettings({...settings, sfx_volume: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="music-volume">Music Volume: {settings.music_volume}</Label>
                <div className="w-32">
                  <Input 
                    id="music-volume" 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={settings.music_volume || 50}
                    onChange={(e) => setSettings({...settings, music_volume: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="audio-enabled">Audio Enabled</Label>
                <Switch 
                  id="audio-enabled" 
                  checked={settings.audio_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, audio_enabled: checked})}
                />
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
                <Select 
                  value={settings.graphics_quality || "medium"} 
                  onValueChange={(value) => setSettings({...settings, graphics_quality: value})}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
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
                <Label htmlFor="notifications">Notifications</Label>
                <Switch 
                  id="notifications" 
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => setSettings({...settings, notifications_enabled: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">Auto Save</Label>
                <Switch 
                  id="auto-save" 
                  checked={settings.auto_save}
                  onCheckedChange={(checked) => setSettings({...settings, auto_save: checked})}
                />
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
          
          <Button onClick={updateSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}