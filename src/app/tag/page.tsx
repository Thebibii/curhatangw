"use client";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import LoadingState from "@/components/state/LoadingState";
import FilterTag from "@/components/tag/FilterTag";
import { useUserContext } from "@/contexts/UserContext";
import { usePostByTag } from "@/hooks/reactQuery/tags/usePostByTag";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Tag() {
  const searchParams = useSearchParams();
  const search = searchParams.get("s");
  const { user } = useUserContext();

  const { data, refetch, isFetching } = usePostByTag({
    tag_names: search?.split(" ") || [],
  });

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  return (
    <div className="flex flex-col space-y-4">
      {search && <FilterTag search={search} />}
      <div className="space-y-6">
        {isFetching ? (
          <SkeletonCard length={3} />
        ) : (
          <LoadingState
            data={data?.data}
            loadingFallback={<SkeletonCard length={3} />}
          >
            {data?.data?.map((post: any) => (
              <PostCard
                post={post}
                dbUserId={user?.data?.id}
                username={user?.data?.username}
                key={post.id}
              />
            ))}
          </LoadingState>
        )}
      </div>
    </div>
  );
}
