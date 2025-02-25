"use client";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import LoadingState from "@/components/state/LoadingState";
import FilterTag from "@/components/tag/FilterTag";
import { useUserContext } from "@/contexts/UserContext";
import { usePostByTag } from "@/hooks/reactQuery/tags/usePostByTag";
import { useSearchParams } from "next/navigation";

export default function Tag() {
  const searchParams = useSearchParams();

  const search = searchParams.get("s");
  const { user } = useUserContext();

  const { data: dataPost } = usePostByTag({
    tag_names: search?.split(" ") || [],
  });

  return (
    <div className="flex flex-col space-y-4">
      {search && <FilterTag search={search} />}
      <div className="space-y-6">
        <LoadingState
          data={dataPost?.data}
          loadingFallback={<SkeletonCard length={5} />}
        >
          {dataPost?.data.map((post: any) => (
            <PostCard
              post={post}
              dbUserId={user?.data?.id}
              username={user?.data?.username}
              key={post.id}
            />
          ))}
        </LoadingState>
      </div>
    </div>
  );
}
