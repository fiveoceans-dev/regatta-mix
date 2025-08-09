import { PageSkeleton, TableSkeleton, CardGridSkeleton } from "@/components/ui/page-skeleton"

export default function ProtestRoom() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Protest Room</h1>
        <p className="text-muted-foreground">File and review race protests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Active Protests</h2>
          <TableSkeleton />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Decisions</h2>
          <TableSkeleton />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Filing a New Protest</h2>
        <CardGridSkeleton />
      </div>
    </div>
  )
}