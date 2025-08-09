export function StandingPanel() {
  return (
    <div className="space-y-1 text-xs">
      {[
        { rank: 1, name: 'WindMaster (You)', distance: '2.1nm', current: true },
        { rank: 2, name: 'SailShark', distance: '2.2nm', current: false },
        { rank: 3, name: 'TackTitan', distance: '2.3nm', current: false },
        { rank: 4, name: 'GybeGuru', distance: '2.4nm', current: false },
        { rank: 5, name: 'SpeedDemon', distance: '2.5nm', current: false }
      ].map((sailor) => (
        <div key={sailor.rank} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
          <span className="text-muted-foreground font-bold w-3">{sailor.rank}</span>
          <span className={`flex-1 text-xs ml-2 truncate ${sailor.current ? 'text-sailing-success font-bold' : 'text-foreground'}`}>
            {sailor.name}
          </span>
          <span className="text-xs">{sailor.distance}</span>
        </div>
      ))}
    </div>
  )
}