import { Boat, WindData } from "@/types/game-types"

interface InstrumentsPanelProps {
  playerBoat?: Boat
  wind?: WindData
}

export function InstrumentsPanel({ playerBoat, wind }: InstrumentsPanelProps) {
  return (
    <div>
      <div className="text-center mb-3">
        <div className="instruments-text-label text-xs mb-1">BOAT SPD</div>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl instruments-text-primary">
            {playerBoat ? playerBoat.speed.toFixed(1) : "--"}
          </span>
          <span className="text-xs instruments-text-label ml-1">kn</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div>
          <div className="instruments-text-label">HDG</div>
          <div className="instruments-text-secondary">
            {playerBoat ? Math.round(playerBoat.heading * (180 / Math.PI)) + "°" : "--"}
          </div>
        </div>
        <div>
          <div className="instruments-text-label">TWS</div>
          <div className="instruments-text-secondary">
            {wind ? wind.speed.toFixed(1) : "--"}
          </div>
        </div>
        <div>
          <div className="instruments-text-label">VMG</div>
          <div className="instruments-text-accent">
            {playerBoat?.vmg !== undefined ? playerBoat.vmg.toFixed(1) : "--"}
          </div>
        </div>
        <div>
          <div className="instruments-text-label">DTM</div>
          <div className="instruments-text-accent">--</div>
        </div>
      </div>
    </div>
  )
}