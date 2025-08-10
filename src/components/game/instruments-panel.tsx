import { useGameState } from "@/hooks/use-game-state"

export function InstrumentsPanel() {
  const { gameState } = useGameState()
  const player = gameState.boats.find(b => b.id === gameState.playerId)

  return (
    <div>
      <div className="text-center mb-3">
        <div className="instruments-text-label text-xs mb-1">BOAT SPD</div>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl instruments-text-primary">
            {player ? player.speed.toFixed(1) : "0.0"}
          </span>
          <span className="text-xs instruments-text-label ml-1">kn</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div>
          <div className="instruments-text-label">HDG</div>
          <div className="instruments-text-secondary">
            {player ? Math.round(player.heading * (180 / Math.PI)).toString().padStart(3, "0") : "000"}°
          </div>
        </div>
        <div>
          <div className="instruments-text-label">TWS</div>
          <div className="instruments-text-secondary">
            {gameState.wind ? gameState.wind.speed.toFixed(1) : "0.0"}
          </div>
        </div>
        <div>
          <div className="instruments-text-label">VMG</div>
          <div className="instruments-text-accent">
            {player && player.vmg !== undefined ? player.vmg.toFixed(1) : "0.0"}
          </div>
        </div>
        <div>
          <div className="instruments-text-label">DTM</div>
          <div className="instruments-text-accent">
            {player && player.distanceToMark !== undefined ? player.distanceToMark.toFixed(1) : "0.0"}
          </div>
        </div>
      </div>
    </div>
  )
}