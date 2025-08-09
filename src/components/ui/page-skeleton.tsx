import { Skeleton } from "@/components/ui/skeleton"

export function PageSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-[400px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      
      {/* Stats cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border border-border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-[200px]" />
            <div className="border border-border rounded-lg p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center py-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-3 w-[40px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-[250px]" />
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        {/* Table rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border last:border-b-0">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="border border-border rounded-lg p-6 space-y-4">
          <Skeleton className="h-[140px] w-full rounded-md" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-[180px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[140px]" />
          </div>
          <div className="pt-2">
            <Skeleton className="h-9 w-[120px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium">
            <Skeleton className="h-4 w-[40px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[60px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border last:border-b-0">
            <div className="grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}