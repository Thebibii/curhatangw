import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserPost } from "@/hooks/reactQuery/posts/useGetUserPost";
import { FileTextIcon, HeartIcon } from "lucide-react";
import LoadingState from "../LoadingState";
import { Skeleton } from "../ui/skeleton";
import PostCard from "../post/PostCard";

export default function PostAndLike({
  userId,
  currentUser,
}: {
  userId: string;
  currentUser: any;
}) {
  const { data, isLoading } = useGetUserPost({ userId });

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="posts"
          className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
        >
          <FileTextIcon className="size-4" />
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="likes"
          className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
        >
          <HeartIcon className="size-4" />
          Likes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <div className="space-y-6">
          <LoadingState
            data={data?.data}
            loadingFallback={<Skeleton className="w-full h-36" />}
          >
            {data?.data ? (
              data?.data?.map((post: any) => (
                <PostCard key={post.id} post={post} dbUserId={currentUser} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No posts yet
              </div>
            )}
          </LoadingState>
        </div>
      </TabsContent>

      {/*  <TabsContent value="likes" className="mt-6">
        <div className="space-y-6">
          {likedPosts.length > 0 ? (
            likedPosts.map((post) => (
              <PostCard key={post.id} post={post} dbUserId={user?.data?.id} />
            ))
          ) : (
            <div className="text-center py-8 text-mtext">
              No liked posts to show
            </div>
          )}
        </div>
      </TabsContent> */}
    </Tabs>
  );
}
