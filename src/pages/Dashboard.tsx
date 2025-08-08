import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, User } from "lucide-react"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex w-full">
          <DashboardSidebar />
          
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}