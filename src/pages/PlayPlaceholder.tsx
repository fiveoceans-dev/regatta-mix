import { PageSkeleton } from "@/components/ui/page-skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Settings, Users, Wind } from "lucide-react"

export default function PlayPlaceholder() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Play</h1>
        <p className="text-muted-foreground">Join races and practice sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Join */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Quick Join
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Multiplayer</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Wind className="h-6 w-6" />
                <span className="text-sm">Practice</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Game Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PageSkeleton />
          </CardContent>
        </Card>
      </div>

      {/* Available Races */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Available Races</h2>
        <PageSkeleton />
      </div>
    </div>
  )
}