import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Icons } from "../icons";
import { useGetTagByTrending } from "@/hooks/reactQuery/tags/useGetTagByTrending";
import LoadingState from "../state/LoadingState";
import WhatsHappeningSkeleton from "../skeleton/WhatsHappeningSkeleton";

export default function WhatsHappening() {
  const { data } = useGetTagByTrending();
  return (
    <Card className="bg-bw">
      <CardHeader>
        <CardTitle>What's Happening</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadingState
          data={data?.data}
          loadingFallback={<WhatsHappeningSkeleton />}
        >
          <div className="space-y-4 ">
            {data?.data?.map((tag: any) => (
              <div className="flex gap-2 items-start" key={tag.id}>
                <Link href={`/tag?s=${tag.name}`} className="flex-1">
                  <div className="flex flex-col space-y-1.5">
                    <h1 className="font-semibold text-base  leading-none">
                      #{tag.name}
                    </h1>
                    <p className="text-sm text-secondary leading-none">
                      {tag._count.posts} Tweets
                    </p>
                  </div>
                </Link>

                <Icons.MoreHorizontalIcon className="size-4" />
              </div>
            ))}
          </div>
        </LoadingState>
      </CardContent>
    </Card>
  );
}
