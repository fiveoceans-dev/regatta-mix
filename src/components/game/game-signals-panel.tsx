export function GameSignalsPanel() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-black border-2 border-primary rounded-lg flex items-center justify-center mx-auto mb-2">
        <span className="text-2xl text-sailing-warning">⚡</span>
      </div>
      <div className="text-xs text-muted-foreground">Starting Signal</div>
    </div>
  )
}