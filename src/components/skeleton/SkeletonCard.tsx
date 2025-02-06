import { Skeleton } from "../ui/skeleton";

export default function SkeletonCard({ length }: { length: number }) {
  const skeletonItems = Array.from({ length }, (_, i) => i);

  return (
    <>
      {skeletonItems.map((index) => (
        <Skeleton key={index} className="w-full h-fit">
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex space-x-3 sm:space-x-4">
                <Skeleton className="w-10 h-10 rounded-full" />

                <div className="flex-1 min-w-0 space-y-4">
                  <Skeleton className="w-14 h-8 rounded-md" />
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                      <Skeleton className="w-36 h-4 " />
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Skeleton className="w-20 h-4 " />
                        <span>•</span>
                        <Skeleton className="w-20 h-4 " />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="w-full h-4 " />
                </div>
              </div>

              <div className="flex items-center pt-2 space-x-4">
                <Skeleton className="w-14 h-8 rounded-md" />
                <Skeleton className="w-14 h-8 rounded-md" />
              </div>
            </div>
          </div>
        </Skeleton>
      ))}
    </>
  );
}
