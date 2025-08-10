import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGameState } from "@/hooks/use-game-state"

export function StandingPanel() {
  const { gameState } = useGameState()

  const standings = [...gameState.boats]
    .sort((a, b) => (a.position || 99) - (b.position || 99))

  return (
    <div className="h-48">
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {standings.slice(0, 10).map((boat, index) => (
            <div key={boat.id} className="flex items-center gap-2 py-1 text-xs">
              <span className="standing-text-primary w-4 text-center">{index + 1}</span>
              <Avatar className="h-4 w-4">
                <AvatarImage src={`/placeholder-avatar-${index + 1}.png`} />
                <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                  {boat.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <span
                className={`flex-1 truncate font-bold standing-text-primary ${
                  boat.id === gameState.playerId ? 'standing-text-user' : ''
                }`}
              >
                {boat.name || `Boat ${boat.number}`}
                {boat.id === gameState.playerId ? ' (you)' : ''}
              </span>
              <span className="standing-text-primary">
                {boat.distanceToFinish !== undefined
                  ? `${boat.distanceToFinish.toFixed(1)}nm`
                  : '--'}
              </span>
            </div>
          ))}
          {standings.length > 10 && (
            <div className="text-center standing-text-primary text-xs py-1">
              +{standings.length - 10} more sailors
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}