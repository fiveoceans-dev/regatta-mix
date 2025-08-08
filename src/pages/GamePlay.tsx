import { SailingScene } from "@/components/game/sailing-scene"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, Compass, Flag, Clock, Users } from "lucide-react"

export default function GamePlay() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Full Screen Game Scene */}
      <div className="absolute inset-0">
        <SailingScene />
      </div>

      {/* Game UI Overlays */}
      
      {/* Top Game Info Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <Card className="bg-black/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="text-primary font-bold">Mediterranean Sprint Championship</div>
              <div className="bg-sailing-success/20 text-sailing-success px-3 py-1 rounded-md font-semibold">
                5:42 to Start
              </div>
              <div className="text-muted-foreground">156/200 sailors</div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Menu</Button>
          <Button variant="secondary" size="sm">Settings</Button>
        </div>
      </div>

      {/* Right Side Panels */}
      <div className="absolute top-20 right-4 w-80 space-y-4 z-10">
        {/* Signal Flag Panel */}
        <Card className="bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 text-center">
            <div className="w-24 h-24 bg-black border-2 border-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl text-sailing-warning">⚡</span>
            </div>
            <div className="text-xs text-muted-foreground">Starting Signal</div>
          </CardContent>
        </Card>

        {/* B&G Style Instruments */}
        <Card className="bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-muted-foreground text-xs mb-1">BOAT SPD</div>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-primary">10.6</span>
                <span className="text-sm text-muted-foreground ml-1">kn</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center text-xs">
              <div>
                <div className="text-muted-foreground">HDG</div>
                <div className="text-primary font-bold">045°</div>
              </div>
              <div>
                <div className="text-muted-foreground">TWS</div>
                <div className="text-primary font-bold">12.5</div>
              </div>
              <div>
                <div className="text-muted-foreground">VMG</div>
                <div className="text-primary font-bold">8.2</div>
              </div>
              <div>
                <div className="text-muted-foreground">DTM</div>
                <div className="text-primary font-bold">2.1</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Standings */}
        <Card className="bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <h4 className="text-primary mb-3 text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Live Standings
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { rank: 1, name: 'WindMaster (You)', distance: '2.1nm', current: true },
                { rank: 2, name: 'SailShark', distance: '2.2nm', current: false },
                { rank: 3, name: 'TackTitan', distance: '2.3nm', current: false },
                { rank: 4, name: 'GybeGuru', distance: '2.4nm', current: false },
                { rank: 5, name: 'SpeedDemon', distance: '2.5nm', current: false }
              ].map((sailor) => (
                <div key={sailor.rank} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground font-bold w-4">{sailor.rank}</span>
                  <span className={`flex-1 text-xs ml-2 ${sailor.current ? 'text-sailing-success font-bold' : 'text-foreground'}`}>
                    {sailor.name}
                  </span>
                  <span className="text-xs">{sailor.distance}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wind Indicator */}
      <div className="absolute top-20 left-4 z-10">
        <Card className="bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <div className="w-16 h-16 bg-secondary rounded-full relative mx-auto mb-3 flex items-center justify-center">
              <Wind className="h-8 w-8 text-primary transform rotate-45" />
            </div>
            <div className="text-center text-primary text-xs">
              <div className="font-bold">12.5 kts</div>
              <div>045° True</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Control Panels */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4 z-10">
        {/* Sailing Controls */}
        <Card className="flex-1 bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Sailing Controls
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {['Tack to Port', 'Tack to Starboard', 'Bear Away', 'Head Up'].map((action) => (
                <Button 
                  key={action}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Race Actions */}
        <Card className="flex-1 bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Race Actions
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['Protest', 'Redress', 'Retire'].map((action) => (
                <Button 
                  key={action}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* View Options */}
        <Card className="flex-1 bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              View Options
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Course', active: true },
                { name: 'Tactical', active: false },
                { name: 'Wind Map', active: false },
                { name: 'Currents', active: false }
              ].map((option) => (
                <Button 
                  key={option.name}
                  variant={option.active ? "default" : "secondary"}
                  size="sm"
                  className="text-xs"
                >
                  {option.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Race Control Chat */}
      <div className="absolute bottom-4 right-4 w-80 z-10">
        <Card className="bg-black/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-4">
            <h4 className="text-primary mb-3 text-sm font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Race Control
            </h4>
            <div className="h-32 overflow-y-auto text-xs space-y-1 mb-3">
              {[
                { sender: 'Race Control', message: '5 minutes to start sequence', color: 'text-sailing-success' },
                { sender: 'SailShark', message: 'Good luck everyone!', color: 'text-primary' },
                { sender: 'TackTitan', message: 'Wind shift coming from the right', color: 'text-sailing-warning' }
              ].map((msg, index) => (
                <div key={index} className="leading-relaxed">
                  <strong className={msg.color}>{msg.sender}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type message..." 
                className="flex-1 bg-secondary border border-border text-foreground px-2 py-1 rounded text-xs"
              />
              <Button size="sm" className="text-xs">Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}