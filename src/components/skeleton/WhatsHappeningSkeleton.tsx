import { Skeleton } from "../ui/skeleton";

export default function WhatsHappeningSkeleton() {
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div className="space-y-4 ">
      {skeletonItems.map((index) => (
        <div className="flex gap-2 items-start" key={index}>
          <div className="flex flex-col flex-1 space-y-1.5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
