"use client";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import LoadingState from "@/components/state/LoadingState";
import { useGetTags } from "@/hooks/reactQuery/tags/useGetTags";
import { usePostByTag } from "@/hooks/reactQuery/tags/usePostByTag";
import { useSearchParams } from "next/navigation";

export default function Tag() {
  const searchParams = useSearchParams();

  const search = searchParams.get("s");

  const { data } = useGetTags({
    tag_ids: search?.split(" ") || [],
    tag_names: "",
    isFetch: true,
  });

  const { data: dataPost } = usePostByTag({
    tag_names: search?.split(" ") || [],
  });

  return (
    <div>
      Tag{" "}
      <span className="mr-2">{data?.data?.map((tag: any) => tag.name)}</span>
      <div className="space-y-6">
        <LoadingState
          data={dataPost?.data}
          loadingFallback={<SkeletonCard length={5} />}
        >
          {dataPost?.data.map((post: any) => (
            <PostCard post={post} dbUserId="id" key={post.id} />
          ))}
        </LoadingState>
      </div>
    </div>
  );
}
