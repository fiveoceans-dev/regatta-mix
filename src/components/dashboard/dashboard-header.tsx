import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export function DashboardHeader() {
  const [date, setDate] = useState<Date>(new Date())
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Date/Time Display with Calendar */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <CalendarIcon className="h-4 w-4" />
                <div className="text-sm">
                  <div className="font-medium">{format(new Date(), 'MMM dd, yyyy')}</div>
                  <div className="text-xs">{format(new Date(), 'HH:mm')}</div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}