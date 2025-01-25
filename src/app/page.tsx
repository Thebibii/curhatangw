"use client";
import CreatePost from "@/components/CreatePost";
import LoadingState from "@/components/LoadingState";
import PostCard from "@/components/post/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import WhoToFollow from "@/components/follow/WhoToFollow";
import { useUserContext } from "@/contexts/UserContext";
import { useGetPost } from "@/hooks/reactQuery/posts/useGetPost";
import Link from "next/link";

export default function Home() {
  const { data, isLoading } = useGetPost();

  const { user } = useUserContext();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        <CreatePost />

        <div className="space-y-6">
          <LoadingState
            data={isLoading === false}
            loadingFallback={<Skeleton className="w-full h-36" />}
          >
            {data?.data?.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                dbUserId={user?.data?.id}
                isLoading={isLoading}
              />
            ))}
          </LoadingState>
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <WhoToFollow />
      </div>
    </div>
  );
}
