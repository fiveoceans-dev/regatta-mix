import { useState, WheelEvent } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { SailingGame2D } from "@/components/game/sailing-game-2d"
import { GameStateProvider, useGameState } from "@/hooks/use-game-state"
import { useWebSocket } from "@/hooks/use-websocket"
import { CollapsibleGameCard } from "@/components/game/collapsible-game-card"
import { GameSignalsPanel } from "@/components/game/game-signals-panel"
import { RaceControlChat } from "@/components/game/race-control-chat"
import { InstrumentsPanel } from "@/components/game/instruments-panel"
import { StandingPanel } from "@/components/game/standing-panel"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GameButton } from "@/components/ui/game-button"

export default function GamePlay() {
  return (
    <GameStateProvider>
      <GamePlayContent />
    </GameStateProvider>
  )
}

function GamePlayContent() {
  const { gameState, dispatch } = useGameState()
  const { connectionState } = useWebSocket('ws://localhost:8080')
  const [showDebug, setShowDebug] = useState(false)
  const [zoom, setZoom] = useState(1)

  const ZOOM_STEP = 0.5
  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 2
  const ZOOM_LEVELS = { S: 0.5, M: 1, L: 2 } as const

  const adjustZoom = (delta: number) => {
    setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
  }

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault()
    adjustZoom(event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP)
  }

  const playerBoat = gameState.boats.find(boat => boat.id === gameState.playerId)

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col">
      {/* Full Screen 2D Sailing Game */}
      <div className="absolute inset-0" onWheel={handleWheel}>
        <SailingGame2D gameState={gameState} zoom={zoom} />
      </div>

      {/* Game UI Overlays */}

      {/* Top Game Info Bar */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-transparent backdrop-blur-sm border border-border/30 rounded-none shadow-sm">
          <CardContent className="p-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                {connectionState === 'connected' ? (
                  <Wifi className="w-4 h-4 text-sailing-success" />
                ) : (
                  <WifiOff className="w-4 h-4 text-sailing-danger" />
                )}
                <span className="font-semibold">
                  {connectionState.toUpperCase()}
                </span>
              </div>
              <div className="text-primary font-semibold hidden sm:block">
                Mediterranean Sprint Championship
              </div>
              <div className="text-primary font-semibold sm:hidden">Med Sprint</div>
              <div className="bg-sailing-success/20 text-sailing-success px-2 py-1 rounded-md font-semibold text-xs border border-sailing-success/30">
                {gameState.raceTime || '00:00'}
              </div>
              <div className="text-muted-foreground text-xs hidden md:block font-medium">
                {gameState.boats.length} sailors
              </div>
              <Badge variant={gameState.raceStatus === 'racing' ? 'default' : 'secondary'} className="text-xs font-medium">
                {gameState.raceStatus?.toUpperCase() || 'WAITING'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left Side Panels */}
      <div className="absolute top-14 left-2 w-12 sm:w-64 lg:w-72 space-y-2 z-10 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Signals Panel */}
        <CollapsibleGameCard title="Signals" position="left">
          <GameSignalsPanel />
        </CollapsibleGameCard>

        {/* Race Control Chat */}
        <CollapsibleGameCard title="Chat" position="left">
          <RaceControlChat />
        </CollapsibleGameCard>
      </div>

      {/* Right Side Panels */}
      <div className="absolute top-14 right-2 w-12 sm:w-64 lg:w-72 space-y-2 z-10 max-h-[calc(100vh-140px)] overflow-y-auto">
        {/* Instruments Panel */}
        <CollapsibleGameCard title="Instruments" position="right">
          <InstrumentsPanel playerBoat={playerBoat} wind={gameState.wind} />
        </CollapsibleGameCard>

        {/* Standing Panel */}
        <CollapsibleGameCard title="Standing" position="right">
          <StandingPanel boats={gameState.boats} playerId={gameState.playerId} />
        </CollapsibleGameCard>
      </div>

      {/* Footer with Controls - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* Control Panels */}
        <div className="flex justify-between items-end px-2 pb-2 pointer-events-auto">
          {/* Left Actions Panel - Hidden on small screens */}
          <div className="w-0 sm:w-32 transition-all">
            <div className="hidden sm:block">
              <Card className="bg-transparent backdrop-blur-sm border border-border/30 rounded-none shadow-sm">
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                    Commands
                  </h3>
                  <div className="flex flex-col gap-1">
                    {['Protest', 'Redress', 'Retire'].map((action) => (
                      <GameButton key={action}>{action}</GameButton>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Center Controls Panel - Always visible, responsive width */}
          <div className="w-full sm:w-96 max-w-2xl mx-2">
            <Card className="bg-transparent backdrop-blur-sm border border-border/30 rounded-none shadow-sm">
              <CardContent className="p-2 sm:p-3">
                <h3 className="text-xs sm:text-sm font-semibold text-primary mb-2 uppercase tracking-wide text-center">
                  Controls
                </h3>
                <div className="flex gap-2 sm:gap-3">
                  {/* Left Column - Hoisting Sails - Hidden on small screens */}
                  <div className="hidden sm:flex flex-col gap-1 min-w-0">
                    <div className="text-xs text-primary text-center mb-1 font-semibold">
                      Sails
                    </div>
                    {['Mainsail', 'Jib', 'Spinnaker'].map((sail) => (
                      <GameButton key={sail}>{sail}</GameButton>
                    ))}
                  </div>

                  {/* Vertical Separator - Hidden on small screens */}
                  <div className="hidden sm:block w-px bg-border"></div>

                  {/* Center Column - Main Controls - Responsive grid */}
                  <div className="flex-1 min-w-0">
                    {/* Top row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-1">
                      <GameButton className="hidden sm:block" onClick={() => dispatch({ type: 'TACK' })}>
                        Tack
                      </GameButton>
                      <GameButton onClick={() => dispatch({ type: 'GYBE' })}>
                        Gybe
                      </GameButton>
                      <GameButton className="hidden sm:block">Port</GameButton>
                    </div>
                    {/* Second row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-1">
                      <GameButton className="hidden sm:block">Starboard</GameButton>
                      <GameButton>Tack to Port</GameButton>
                      <GameButton>Tack to Starboard</GameButton>
                    </div>
                    {/* Third row */}
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      {['Bear Away', 'Head Up'].map((action) => (
                        <GameButton key={action}>{action}</GameButton>
                      ))}
                    </div>
                    {/* Fourth row */}
                    <div className="grid grid-cols-2 gap-1">
                      {['Trim', 'Ease'].map((action) => (
                        <GameButton key={action}>{action}</GameButton>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Separator - Hidden on small screens */}
                  <div className="hidden sm:block w-px bg-border"></div>

                  {/* RIght Column - Hoisting Sails - Hidden on small screens */}
                  <div className="hidden sm:flex flex-col gap-1 min-w-0">
                    <div className="text-xs text-primary text-center mb-1 font-semibold">
                      Commands
                    </div>
                    {['Port', 'Stabord', 'Spinnaker'].map((sail) => (
                      <GameButton key={sail}>{sail}</GameButton>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right View Panel - Hidden on small screens */}
          <div className="w-0 sm:w-32 transition-all">
            <div className="hidden sm:block space-y-2">
              <Card className="bg-transparent backdrop-blur-sm border border-border/30 rounded-none shadow-sm">
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                    Zoom
                  </h3>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1 mb-1">
                      <GameButton onClick={() => adjustZoom(ZOOM_STEP)}>+</GameButton>
                      <GameButton onClick={() => adjustZoom(-ZOOM_STEP)}>-</GameButton>
                    </div>
                    <div className="flex gap-1">
                      <GameButton
                        variant={zoom === ZOOM_LEVELS.S ? "default" : "secondary"}
                        onClick={() => setZoom(ZOOM_LEVELS.S)}
                      >
                        S
                      </GameButton>
                      <GameButton
                        variant={zoom === ZOOM_LEVELS.M ? "default" : "secondary"}
                        onClick={() => setZoom(ZOOM_LEVELS.M)}
                      >
                        M
                      </GameButton>
                      <GameButton
                        variant={zoom === ZOOM_LEVELS.L ? "default" : "secondary"}
                        onClick={() => setZoom(ZOOM_LEVELS.L)}
                      >
                        L
                      </GameButton>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent backdrop-blur-sm border border-border/30 rounded-none shadow-sm">
                <CardContent className="p-3">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                    View
                  </h3>
                  <div className="flex flex-col gap-1">
                    {[
                      { name: 'Course', active: true },
                      { name: 'Tactical', active: false },
                      { name: 'Wind Map', active: false },
                      { name: 'Currents', active: false },
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

      {/* Debug toggle and panel */}
      <div className="absolute bottom-24 right-4 pointer-events-auto">
        <GameButton onClick={() => setShowDebug(!showDebug)}>Debug</GameButton>
      </div>
      {showDebug && (
        <div className="absolute bottom-40 right-4 pointer-events-auto">
          <Card className="p-4 bg-card/90 backdrop-blur-sm max-w-xs">
            <div className="space-y-2 text-xs">
              <div className="text-muted-foreground font-medium">DEBUG INFO</div>
              <div>FPS: {Math.round(1000 / (gameState.deltaTime || 16))}</div>
              <div>Tick: {gameState.tick || 0}</div>
              <div>Ping: {gameState.ping || 0}ms</div>
              {playerBoat && (
                <>
                  <div>Pos: ({playerBoat.x.toFixed(1)}, {playerBoat.z.toFixed(1)})</div>
                  <div>Penalties: {playerBoat.penalties?.length || 0}</div>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

