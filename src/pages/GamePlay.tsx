import { SailingGame2D } from "@/components/game/sailing-game-2d"
import { GameStateProvider } from "@/hooks/use-game-state"
import { CollapsibleGameCard } from "@/components/game/collapsible-game-card"
import { GameSignalsPanel } from "@/components/game/game-signals-panel"
import { RaceControlChat } from "@/components/game/race-control-chat"
import { InstrumentsPanel } from "@/components/game/instruments-panel"
import { StandingPanel } from "@/components/game/standing-panel"
import { Card, CardContent } from "@/components/ui/card"
import { GameButton } from "@/components/ui/game-button"

export default function GamePlay() {
  return (
    <GameStateProvider>
      <div className="h-screen w-screen overflow-hidden relative flex flex-col">
        {/* Full Screen 2D Sailing Game */}
        <div className="absolute inset-0">
          <SailingGame2D />
        </div>

      {/* Game UI Overlays */}
      
      
      </div>
    </GameStateProvider>
  )
}