import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export function StandingPanel() {
  const standings = [
    { rank: 1, name: 'WindMaster', username: 'WindMaster', distance: '2.1nm', current: true },
    { rank: 2, name: 'SailShark', username: 'SailShark', distance: '2.2nm', current: false },
    { rank: 3, name: 'TackTitan', username: 'TackTitan', distance: '2.3nm', current: false },
    { rank: 4, name: 'GybeGuru', username: 'GybeGuru', distance: '2.4nm', current: false },
    { rank: 5, name: 'SpeedDemon', username: 'SpeedDemon', distance: '2.5nm', current: false },
    { rank: 6, name: 'WaveRider', username: 'WaveRider', distance: '2.6nm', current: false },
    { rank: 7, name: 'StormSailor', username: 'StormSailor', distance: '2.7nm', current: false },
    { rank: 8, name: 'OceanLord', username: 'OceanLord', distance: '2.8nm', current: false },
    { rank: 9, name: 'SeaHawk', username: 'SeaHawk', distance: '2.9nm', current: false },
    { rank: 10, name: 'Mariner', username: 'Mariner', distance: '3.0nm', current: false },
    { rank: 11, name: 'DeepBlue', username: 'DeepBlue', distance: '3.1nm', current: false },
    { rank: 12, name: 'SaltWater', username: 'SaltWater', distance: '3.2nm', current: false }
  ]

  return (
    <div className="h-48">
      <ScrollArea className="h-full">
        <div className="space-y-1">
          {standings.slice(0, 10).map((sailor) => (
            <div key={sailor.rank} className="flex items-center gap-2 py-1 text-xs">
              <span className="standing-text-primary w-4 text-center">{sailor.rank}</span>
              <Avatar className="h-4 w-4">
                <AvatarImage src={`/placeholder-avatar-${sailor.rank}.png`} />
                <AvatarFallback className="text-[8px] bg-primary text-primary-foreground">
                  {sailor.username[0]}
                </AvatarFallback>
              </Avatar>
              <span className={`flex-1 truncate font-bold standing-text-primary ${
                sailor.current ? 'standing-text-user' : ''
              }`}>
                {sailor.username}{sailor.current ? ' (you)' : ''}
              </span>
              <span className="standing-text-primary">{sailor.distance}</span>
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