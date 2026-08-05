import { Skeleton } from "@/components/ui/skeleton";
import "@/assets/styles/components/RouteSkeletons.scss";

export function PageHeaderSkeleton() {
    return (<div className="route-skeleton-page-header">
      <Skeleton className="skeleton--h-8 skeleton--w-48"/>
      <Skeleton className="skeleton--h-4 skeleton--w-72"/>
    </div>);
}
export function StatCardsSkeleton({ count = 3 }) {
    return (<div className="route-skeleton-stat-cards">
      {Array.from({ length: count }).map((_, i) => (<Skeleton key={i} className="skeleton--h-28 skeleton--rounded-2xl"/>))}
    </div>);
}
export function TableSkeleton({ rows = 8 }) {
    return (<div className="route-skeleton-table">
      <Skeleton className="skeleton--h-10 skeleton--w-full skeleton--rounded-none"/>
      {Array.from({ length: rows }).map((_, i) => (<Skeleton key={i} className="skeleton--h-12 skeleton--w-full skeleton--rounded-none skeleton--border-t"/>))}
    </div>);
}
export function CardGridSkeleton({ count = 6 }) {
    return (<div className="route-skeleton-card-grid">
      {Array.from({ length: count }).map((_, i) => (<Skeleton key={i} className="skeleton--h-36 skeleton--rounded-2xl"/>))}
    </div>);
}
export function ChartSkeleton() {
    return <Skeleton className="skeleton--h-300 skeleton--w-full skeleton--rounded-2xl"/>;
}
export function DashboardSkeleton() {
    return (<div className="route-skeleton-dashboard">
      <Skeleton className="skeleton--h-24 skeleton--w-full skeleton--rounded-2xl"/>
      <div className="route-skeleton-dashboard__grid">
        <Skeleton className="route-skeleton-dashboard__sidebar skeleton--h-64 skeleton--rounded-2xl"/>
        <Skeleton className="route-skeleton-dashboard__main-a skeleton--h-64 skeleton--rounded-2xl"/>
        <Skeleton className="route-skeleton-dashboard__main-b skeleton--h-64 skeleton--rounded-2xl"/>
      </div>
    </div>);
}
export function MaterialLibrarySkeleton() {
    return (<div className="route-skeleton-material-library">
      <PageHeaderSkeleton />
      <div className="route-skeleton-material-library__layout">
        <Skeleton className="route-skeleton-material-library__sidebar skeleton--h-520 skeleton--w-56 skeleton--rounded-2xl"/>
        <div className="route-skeleton-material-library__main">
          <Skeleton className="skeleton--h-11 skeleton--w-full skeleton--rounded-xl"/>
          <TableSkeleton rows={10}/>
        </div>
      </div>
    </div>);
}
