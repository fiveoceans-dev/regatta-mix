import { SailingScene } from "@/components/game/sailing-scene"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, Compass, Flag, Clock, Users } from "lucide-react"

export default function GamePlay() {
  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col" style={{ overflow: 'hidden' }}>
      {/* Full Screen Game Scene */}
      <div className="absolute inset-0">
        <SailingScene />
      </div>

      {/* Game UI Overlays */}
      
      {/* Top Game Info Bar */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-gray-900/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-primary font-bold">Mediterranean Sprint Championship</div>
              <div className="bg-sailing-success/20 text-sailing-success px-2 py-1 rounded-md font-semibold text-xs">
                5:42 to Start
              </div>
              <div className="text-muted-foreground text-xs">156/200 sailors</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left Side Panels */}
      <div className="absolute top-14 left-2 w-72 space-y-2 z-10 max-h-[calc(100vh-260px)] overflow-y-auto">
        {/* Signals Panel */}
        <Card className="bg-gray-500/30 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 text-center">
            <h4 className="text-primary mb-2 text-xs font-semibold">Signals</h4>
            <div className="w-16 h-16 bg-black border-2 border-primary rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl text-sailing-warning">⚡</span>
            </div>
            <div className="text-xs text-muted-foreground">Starting Signal</div>
          </CardContent>
        </Card>

        {/* Race Control Chat */}
        <Card className="bg-gray-500/30 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <h4 className="text-primary mb-2 text-xs font-semibold flex items-center gap-2">
              <Flag className="h-3 w-3" />
              Race Control
            </h4>
            <div className="h-20 overflow-y-auto text-xs space-y-1 mb-2">
              {[
                { sender: 'RC', message: '5 min to start', color: 'text-sailing-success' },
                { sender: 'SailShark', message: 'Good luck!', color: 'text-primary' },
                { sender: 'TackTitan', message: 'Wind shift right', color: 'text-sailing-warning' }
              ].map((msg, index) => (
                <div key={index} className="leading-tight">
                  <strong className={msg.color}>{msg.sender}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              <input 
                type="text" 
                placeholder="Type..." 
                className="flex-1 bg-secondary border border-border text-foreground px-2 py-1 rounded text-xs h-6"
              />
              <Button size="sm" className="text-xs h-6 px-2">Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side Panels */}
      <div className="absolute top-14 right-2 w-72 space-y-2 z-10 max-h-[calc(100vh-260px)] overflow-y-auto">
        {/* Instruments Panel */}
        <Card className="bg-gray-500/30 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <h4 className="text-primary mb-2 text-xs font-semibold text-center">Instruments</h4>
            <div className="text-center mb-3">
              <div className="text-muted-foreground text-xs mb-1">BOAT SPD</div>
              <div className="flex items-baseline justify-center">
                <span className="text-2xl font-bold text-primary">10.6</span>
                <span className="text-xs text-muted-foreground ml-1">kn</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
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

        {/* Standing Panel */}
        <Card className="bg-gray-500/30 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <h4 className="text-primary mb-2 text-xs font-semibold flex items-center gap-2">
              <Users className="h-3 w-3" />
              Standing
            </h4>
            <div className="space-y-1 text-xs">
              {[
                { rank: 1, name: 'WindMaster (You)', distance: '2.1nm', current: true },
                { rank: 2, name: 'SailShark', distance: '2.2nm', current: false },
                { rank: 3, name: 'TackTitan', distance: '2.3nm', current: false },
                { rank: 4, name: 'GybeGuru', distance: '2.4nm', current: false },
                { rank: 5, name: 'SpeedDemon', distance: '2.5nm', current: false }
              ].map((sailor) => (
                <div key={sailor.rank} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground font-bold w-3">{sailor.rank}</span>
                  <span className={`flex-1 text-xs ml-2 truncate ${sailor.current ? 'text-sailing-success font-bold' : 'text-foreground'}`}>
                    {sailor.name}
                  </span>
                  <span className="text-xs">{sailor.distance}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer with Controls - Fixed to bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Control Panels */}
        <div className="flex justify-between items-end px-2 pb-2 pointer-events-auto">
          {/* Left Actions Panel */}
          <div className="w-32">
            <Card className="bg-card/90 backdrop-blur-sm border-border">
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Actions
                </h3>
                <div className="flex flex-col gap-1">
                  {['Protest', 'Redress', 'Retire'].map((action) => (
                    <Button 
                      key={action}
                      variant="secondary"
                      size="sm"
                      className="text-xs w-full h-7"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Controls Panel */}
          <div className="w-96">
            <Card className="bg-card/90 backdrop-blur-sm border-border">
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide text-center">
                  Controls
                </h3>
                <div className="flex gap-3">
                  {/* Left Column - Hoisting Sails */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="text-xs text-muted-foreground text-center mb-1">Sails</div>
                    {['Mainsail', 'Jib', 'Spinnaker'].map((sail) => (
                      <Button 
                        key={sail}
                        variant="secondary"
                        size="sm"
                        className="text-xs h-6 px-2"
                      >
                        {sail}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Vertical Separator */}
                  <div className="w-px bg-border"></div>
                  
                  {/* Center Column - Main Controls */}
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-3 gap-1 mb-1">
                      {['Ready', 'Abort', 'Tack'].map((action) => (
                        <Button 
                          key={action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-6"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1 mb-1">
                      {['Gybe', 'Port', 'Starboard'].map((action) => (
                        <Button 
                          key={action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-6"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      {['Tack to Port', 'Tack to Starboard'].map((action) => (
                        <Button 
                          key={action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-6"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      {['Bear Away', 'Head Up'].map((action) => (
                        <Button 
                          key={action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-6"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {['Trim', 'Ease'].map((action) => (
                        <Button 
                          key={action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-6"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right View Panel */}
          <div className="w-32">
            <Card className="bg-card/90 backdrop-blur-sm border-border">
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  View
                </h3>
                <div className="flex flex-col gap-1">
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
                      className="text-xs w-full h-7"
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Copyright Footer */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-border/30 py-1 pointer-events-auto">
          <div className="text-center text-xs text-muted-foreground">
            All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  )
}