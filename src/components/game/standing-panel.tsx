import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Boat } from "@/types/game-types"

interface StandingPanelProps {
  boats: Boat[]
  playerId: string
}

export function StandingPanel({ boats, playerId }: StandingPanelProps) {
  const standings = [...boats]
    .sort((a, b) => (a.position || 99) - (b.position || 99))
    .slice(0, 10)

  return (
    <div className="h-48">
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {standings.map((boat, index) => (
            <div key={boat.id} className="flex items-center gap-2 py-1 text-xs">
              <span className="standing-text-primary w-4 text-center">{index + 1}</span>
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                  {(boat.name || `Boat ${boat.number}`)[0]}
                </AvatarFallback>
              </Avatar>
              <span
                className={`flex-1 truncate font-bold standing-text-primary ${
                  boat.id === playerId ? 'standing-text-user' : ''
                }`}
              >
                {boat.name || `Boat ${boat.number}`}
                {boat.id === playerId ? ' (you)' : ''}
              </span>
              <span className="standing-text-primary">{boat.number}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}