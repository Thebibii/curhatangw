import { Skeleton } from "../ui/skeleton";

export default function CommentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex space-x-3 ">
        <Skeleton className="size-8 flex-shrink-0 rounded-full" />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex  w-full items-center gap-x-2 ">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/5" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
