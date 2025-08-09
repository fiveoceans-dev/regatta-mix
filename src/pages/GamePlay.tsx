import { SailingScene } from "@/components/game/sailing-scene"
import { CollapsibleGameCard } from "@/components/game/collapsible-game-card"
import { GameSignalsPanel } from "@/components/game/game-signals-panel"
import { RaceControlChat } from "@/components/game/race-control-chat"
import { InstrumentsPanel } from "@/components/game/instruments-panel"
import { StandingPanel } from "@/components/game/standing-panel"
import { Card, CardContent } from "@/components/ui/card"
import { GameButton } from "@/components/ui/game-button"

export default function GamePlay() {
  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      {/* Full Screen Game Scene */}
      <div className="absolute inset-0">
        <SailingScene />
      </div>

      {/* Game UI Overlays */}
      
      {/* Top Game Info Bar */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-card/90 backdrop-blur-sm border-border rounded-none">
          <CardContent className="p-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="text-primary font-bold hidden sm:block">Mediterranean Sprint Championship</div>
              <div className="text-primary font-bold sm:hidden">Med Sprint</div>
              <div className="bg-sailing-success/20 text-sailing-success px-2 py-1 rounded-md font-semibold text-xs">
                5:42 to Start
              </div>
              <div className="text-muted-foreground text-xs hidden md:block">156/200 sailors</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left Side Panels */}
      <div className="absolute top-14 left-2 w-12 sm:w-64 lg:w-72 space-y-2 z-10 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Signals Panel */}
        <CollapsibleGameCard
          title="Signals"
          position="left"
        >
          <GameSignalsPanel />
        </CollapsibleGameCard>

        {/* Race Control Chat */}
        <CollapsibleGameCard
          title="Race Control"
          position="left"
        >
          <RaceControlChat />
        </CollapsibleGameCard>
      </div>

      {/* Right Side Panels */}
      <div className="absolute top-14 right-2 w-12 sm:w-64 lg:w-72 space-y-2 z-10 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Instruments Panel */}
        <CollapsibleGameCard
          title="Instruments"
          position="right"
        >
          <InstrumentsPanel />
        </CollapsibleGameCard>

        {/* Standing Panel */}
        <CollapsibleGameCard
          title="Standing"
          position="right"
        >
          <StandingPanel />
        </CollapsibleGameCard>
      </div>

      {/* Footer with Controls - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Control Panels */}
        <div className="flex justify-between items-end px-2 pb-2 pointer-events-auto">
          {/* Left Actions Panel - Hidden on small screens */}
          <div className="w-0 sm:w-32 transition-all">
            <div className="hidden sm:block">
              <Card className="bg-card/90 backdrop-blur-sm border-border rounded-none">
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                    Actions
                  </h3>
                   <div className="flex flex-col gap-1">
                     {['Protest', 'Redress', 'Retire'].map((action) => (
                       <GameButton key={action}>
                         {action}
                       </GameButton>
                     ))}
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center Controls Panel - Always visible, responsive width */}
          <div className="w-full sm:w-96 max-w-2xl mx-2">
            <Card className="bg-card/90 backdrop-blur-sm border-border rounded-none">
              <CardContent className="p-2 sm:p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-primary mb-2 uppercase tracking-wide text-center">
                  Controls
                </h3>
                <div className="flex gap-2 sm:gap-3">
                  {/* Left Column - Hoisting Sails - Hidden on small screens */}
                  <div className="hidden sm:flex flex-col gap-1 min-w-0">
                    <div className="text-xs text-muted-foreground text-center mb-1">Sails</div>
                     {['Mainsail', 'Jib', 'Spinnaker'].map((sail) => (
                       <GameButton key={sail}>
                         {sail}
                       </GameButton>
                     ))}
                  </div>
                  
                  {/* Vertical Separator - Hidden on small screens */}
                  <div className="hidden sm:block w-px bg-border"></div>
                  
                  {/* Center Column - Main Controls - Responsive grid */}
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-1">
                       <GameButton>Ready</GameButton>
                       <GameButton>Abort</GameButton>
                       <GameButton className="hidden sm:block">Tack</GameButton>
                     </div>
                    {/* Second row */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-1">
                       <GameButton>Gybe</GameButton>
                       <GameButton>Port</GameButton>
                       <GameButton className="hidden sm:block">Starboard</GameButton>
                     </div>
                    {/* Third row */}
                     <div className="grid grid-cols-2 gap-1 mb-1">
                       {['Tack to Port', 'Tack to Starboard'].map((action) => (
                         <GameButton key={action}>
                           <span className="hidden sm:inline">{action}</span>
                           <span className="sm:hidden">{action.split(' ')[0]} {action.split(' ')[2]}</span>
                         </GameButton>
                       ))}
                     </div>
                    {/* Fourth row */}
                     <div className="grid grid-cols-2 gap-1 mb-1">
                       {['Bear Away', 'Head Up'].map((action) => (
                         <GameButton key={action}>
                           {action}
                         </GameButton>
                       ))}
                     </div>
                    {/* Fifth row */}
                     <div className="grid grid-cols-2 gap-1">
                       {['Trim', 'Ease'].map((action) => (
                         <GameButton key={action}>
                           {action}
                         </GameButton>
                       ))}
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right View Panel - Hidden on small screens */}
          <div className="w-0 sm:w-32 transition-all">
            <div className="hidden sm:block">
              <Card className="bg-card/90 backdrop-blur-sm border-border rounded-none">
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
                       <GameButton 
                         key={option.name}
                         variant={option.active ? "default" : "secondary"}
                       >
                         {option.name}
                       </GameButton>
                     ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Copyright Footer - Hidden on small screens */}
        <div className="hidden md:block bg-black/20 backdrop-blur-sm border-t border-border/30 py-1 pointer-events-auto">
          <div className="text-center text-xs text-muted-foreground">
            All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  )
}