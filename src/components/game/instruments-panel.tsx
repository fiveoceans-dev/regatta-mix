export function InstrumentsPanel() {
  return (
    <div>
      <div className="text-center mb-3">
        <div className="instruments-text-label text-xs mb-1">BOAT SPD</div>
        <div className="flex items-baseline justify-center">
          <span className="text-2xl instruments-text-primary">10.6</span>
          <span className="text-xs instruments-text-label ml-1">kn</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div>
          <div className="instruments-text-label">HDG</div>
          <div className="instruments-text-secondary">045°</div>
        </div>
        <div>
          <div className="instruments-text-label">TWS</div>
          <div className="instruments-text-secondary">12.5</div>
        </div>
        <div>
          <div className="instruments-text-label">VMG</div>
          <div className="instruments-text-accent">8.2</div>
        </div>
        <div>
          <div className="instruments-text-label">DTM</div>
          <div className="instruments-text-accent">2.1</div>
        </div>
      </div>
    </div>
  )
}