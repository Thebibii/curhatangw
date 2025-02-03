"use client";
import CreatePost from "@/components/CreatePost";
import LoadingState from "@/components/LoadingState";
import ObserverPlaceholder from "@/components/post/ObserverPlaceholder";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/post/SkeletonCard";
import WhoToFollow from "@/components/WhoToFollow";
import { useUserContext } from "@/contexts/UserContext";
import { useGetPost } from "@/hooks/reactQuery/posts/useGetPost";

export default function Home() {
  const { data, fetchNextPage } = useGetPost({
    getNextPageParam: (lastPost: { nextCursor: string }) =>
      lastPost?.nextCursor!,
  });

  const { user } = useUserContext();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <CreatePost />

        <div className="space-y-6">
          <LoadingState
            data={data?.pages[0].data}
            loadingFallback={<SkeletonCard />}
          >
            {data?.pages?.map((response: any) => {
              return response?.data?.map((post: any) => (
                <PostCard key={post.id} post={post} dbUserId={user?.data?.id} />
              ));
            })}
          </LoadingState>
          {!!data?.pages[data?.pages.length - 1]?.nextCursor && (
            <ObserverPlaceholder
              callback={() => {
                fetchNextPage();
              }}
            />
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
