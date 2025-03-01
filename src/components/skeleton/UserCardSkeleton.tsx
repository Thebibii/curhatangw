import { Icons } from "../icons";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function UserCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex flex-col items-center justify-center mt-4">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="mt-4 space-y-1 flex flex-col items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <Skeleton className="h-4 w-32 mt-3 mx-auto" />

      <div className="w-full">
        <Separator className="my-4" />
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col items-center">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
        <Separator className="my-4" />
      </div>

      <div className="w-full space-y-2 text-sm">
        <div className="flex items-center">
          <Icons.MapPinIcon className="w-4 h-4 mr-2 shrink-0" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center">
          <Icons.LinkIcon className="w-4 h-4 mr-2 shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
