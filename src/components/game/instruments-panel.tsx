export function InstrumentsPanel() {
  return (
    <div>
      <div className="text-center mb-3">
        <div className="text-foreground text-xs mb-1 font-medium">BOAT SPD</div>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl font-bold game-text-primary">10.6</span>
          <span className="text-xs text-foreground ml-1 font-medium">kn</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div>
          <div className="text-foreground font-medium">HDG</div>
          <div className="game-text-primary font-bold">045°</div>
        </div>
        <div>
          <div className="text-foreground font-medium">TWS</div>
          <div className="game-text-primary font-bold">12.5</div>
        </div>
        <div>
          <div className="text-foreground font-medium">VMG</div>
          <div className="game-text-primary font-bold">8.2</div>
        </div>
        <div>
          <div className="text-foreground font-medium">DTM</div>
          <div className="game-text-primary font-bold">2.1</div>
        </div>
      </div>
    </div>
  )
}