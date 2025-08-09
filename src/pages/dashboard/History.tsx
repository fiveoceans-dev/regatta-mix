import { PageSkeleton, TableSkeleton, CardGridSkeleton, LeaderboardSkeleton } from "@/components/ui/page-skeleton"

export default function History() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Race History</h1>
        <p className="text-muted-foreground">View your racing performance and statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Races</h2>
          <TableSkeleton rows={10} />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Performance Stats</h2>
          <CardGridSkeleton cards={6} />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Season Progress</h2>
          <LeaderboardSkeleton />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Race Replays</h2>
        <PageSkeleton />
      </div>
    </div>
  )
}