export function InstrumentsPanel() {
  return (
    <div>
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
    </div>
  )
}