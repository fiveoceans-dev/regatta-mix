import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { 
  Home, 
  Play, 
  Scale, 
  Clock, 
  BookOpen, 
  Settings,
  Anchor
} from "lucide-react"

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Play", url: "/play", icon: Play },
  { title: "Protest Room", url: "/protestroom", icon: Scale },
  { title: "History", url: "/history", icon: Clock },
  { title: "Resources", url: "/dashboard/resources", icon: BookOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50"

  return (
    <Sidebar
      className={state === "collapsed" ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-card/50 backdrop-blur-sm border-r border-border/50">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Anchor className="h-8 w-8 text-primary" />
            {state !== "collapsed" && <span className="text-xl font-bold">SailingGame</span>}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={state === "collapsed" ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        {state !== "collapsed" && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">WM</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">WindMaster</p>
                <p className="text-xs text-muted-foreground">Rank #1</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}