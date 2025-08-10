import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function StandingPanel() {
  const standings = [
    { rank: 1, name: 'WindMaster', username: 'You', distance: '2.1nm', current: true },
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
    <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
      {standings.map((sailor) => (
        <div key={sailor.rank} className="flex items-center gap-2 py-1 border-b border-border/30 last:border-0">
          <span className="text-primary font-bold w-4 text-center">{sailor.rank}</span>
          {sailor.current && (
            <Avatar className="h-4 w-4">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="text-[8px] bg-accent text-accent-foreground">WM</AvatarFallback>
            </Avatar>
          )}
          <span className={`flex-1 text-xs truncate font-medium ${
            sailor.current 
              ? 'text-accent font-bold' 
              : 'text-foreground'
          }`}>
            {sailor.current ? sailor.name : sailor.username}
          </span>
          <span className="text-xs font-medium text-foreground">{sailor.distance}</span>
        </div>
      ))}
    </div>
  )
}