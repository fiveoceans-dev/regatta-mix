import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <DashboardHeader />

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