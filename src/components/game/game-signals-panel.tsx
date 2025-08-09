import { raceSignal } from "@/assets";

export function GameSignalsPanel() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-black border-2 border-primary rounded-none flex items-center justify-center mx-auto mb-2 overflow-hidden">
        <img 
          src={raceSignal} 
          alt="Race starting signal" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-xs text-muted-foreground">Starting Signal</div>
    </div>
  )
}