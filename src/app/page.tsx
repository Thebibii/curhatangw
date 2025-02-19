"use client";
import CreatePost from "@/components/post/create/CreatePost";
import LoadingState from "@/components/state/LoadingState";
import ObserverPlaceholder from "@/components/skeleton/ObserverPlaceholder";
import PostCard from "@/components/post/PostCard";
import SkeletonCard from "@/components/skeleton/SkeletonCard";
import WhoToFollow from "@/components/sidebar/WhoToFollow";
import { useUserContext } from "@/contexts/UserContext";
import { useGetPost } from "@/hooks/reactQuery/posts/useGetPost";
import WhatsHappening from "@/components/sidebar/WhatsHappening";

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
            loadingFallback={<SkeletonCard length={3} />}
          >
            {data?.pages?.map((response: any) => {
              return response?.data?.map((post: any, _: number) => (
                <PostCard key={_} post={post} dbUserId={user?.data?.id} />
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

      <div className="hidden lg:flex lg:space-y-8 lg:flex-col lg:col-span-4 sticky top-20">
        <WhatsHappening />
        <WhoToFollow />
      </div>
    </div>
  );
}
