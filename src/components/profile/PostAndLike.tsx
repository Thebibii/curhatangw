import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserPost } from "@/hooks/reactQuery/posts/useGetUserPost";
import { FileTextIcon, HeartIcon } from "lucide-react";
import LoadingState from "../LoadingState";
import PostCard from "../post/PostCard";
import SkeletonCard from "../post/SkeletonCard";

export default function PostAndLike({
  userId,
  currentUser,
}: {
  userId: string;
  currentUser: any;
}) {
  const { data } = useGetUserPost({ userId });

  return (
    <Tabs defaultValue="posts" className="w-full ">
      <TabsList className="w-full justify-start h-auto bg-bw">
        <TabsTrigger
          value="posts"
          className="flex items-center gap-2 data-[state=active]:bg-bw px-6 font-semibold"
        >
          <FileTextIcon className="size-4" />
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="likes"
          className="flex items-center gap-2 data-[state=active]:bg-bw  px-6 font-semibold"
        >
          <HeartIcon className="size-4" />
          Likes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <div className="space-y-6">
          <LoadingState data={data?.data} loadingFallback={<SkeletonCard />}>
            {data?.data &&
              data?.data?.map((post: any) => (
                <PostCard key={post.id} post={post} dbUserId={currentUser} />
              ))}
            {data?.data?.length === 0 && (
              <div className="text-center py-8 text-mtext">
                No posts to show
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
