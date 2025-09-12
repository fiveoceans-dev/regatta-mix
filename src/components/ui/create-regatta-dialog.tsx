import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CreateRegattaDialogProps {
  children?: React.ReactNode
  onSuccess?: () => void
}

export function CreateRegattaDialog({ children, onSuccess }: CreateRegattaDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [registrationDeadline, setRegistrationDeadline] = useState<Date>()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    class: "",
    location: "",
    maxPlayers: "",
    prizePool: "",
    entryFee: "",
    windSpeed: "",
    waveHeight: "",
    weatherCondition: "",
    isPrivate: false,
    code: ""
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .site.regattas()
        .insert({
          name: formData.name,
          description: formData.description,
          class: formData.class as any,
          location: formData.location,
          max_players: parseInt(formData.maxPlayers),
          prize_pool: parseInt(formData.prizePool),
          entry_fee: parseInt(formData.entryFee),
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          registration_deadline: registrationDeadline?.toISOString(),
          wind_speed: formData.windSpeed ? parseInt(formData.windSpeed) : null,
          wave_height: formData.waveHeight ? parseFloat(formData.waveHeight) : null,
          weather_condition: formData.weatherCondition as any,
          organizer_id: user.id,
          status: 'upcoming',
          code: formData.isPrivate ? formData.code : null
        })

      if (error) throw error

      // Deduct 100 credits from user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (profileData) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            credits: Math.max(0, profileData.credits - 100)
          })
          .eq('id', user.id)

        if (updateError) {
          console.warn("Could not deduct credits:", updateError)
        }
      }

      toast.success("Regatta created successfully! 100 credits deducted.")
      setOpen(false)
      setFormData({
        name: "",
        description: "",
        class: "",
        location: "",
        maxPlayers: "",
        prizePool: "",
        entryFee: "",
        windSpeed: "",
        waveHeight: "",
        weatherCondition: "",
        isPrivate: false,
        code: ""
      })
      setStartDate(undefined)
      setEndDate(undefined)
      setRegistrationDeadline(undefined)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating regatta:", error)
      toast.error("Failed to create regatta. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Regatta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Regatta
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost: 100 credits to create a regatta
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Regatta Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Summer Championship"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Boat Class *</Label>
              <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select boat class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="j24">J24</SelectItem>
                  <SelectItem value="j70">J70</SelectItem>
                  <SelectItem value="laser">Laser</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your regatta..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players *</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="2"
                max="50"
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange("maxPlayers", e.target.value)}
                placeholder="e.g., 20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Registration Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !registrationDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {registrationDeadline ? format(registrationDeadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={registrationDeadline}
                    onSelect={setRegistrationDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool (credits) *</Label>
              <Input
                id="prizePool"
                type="number"
                min="0"
                value={formData.prizePool}
                onChange={(e) => handleInputChange("prizePool", e.target.value)}
                placeholder="e.g., 5000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (credits) *</Label>
              <Input
                id="entryFee"
                type="number"
                min="0"
                value={formData.entryFee}
                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                placeholder="e.g., 100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="windSpeed">Wind Speed (knots)</Label>
              <Input
                id="windSpeed"
                type="number"
                min="0"
                max="50"
                value={formData.windSpeed}
                onChange={(e) => handleInputChange("windSpeed", e.target.value)}
                placeholder="e.g., 12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waveHeight">Wave Height (ft)</Label>
              <Input
                id="waveHeight"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={formData.waveHeight}
                onChange={(e) => handleInputChange("waveHeight", e.target.value)}
                placeholder="e.g., 2.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weatherCondition">Weather</Label>
              <Select value={formData.weatherCondition} onValueChange={(value) => handleInputChange("weatherCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => handleInputChange('isPrivate', checked)}
              />
              <Label htmlFor="private">Private Regatta</Label>
            </div>
            
            {formData.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="code">Access Code *</Label>
                <Input
                  id="code"
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Enter access code for participants"
                  required={formData.isPrivate}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Regatta (100 credits)"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}