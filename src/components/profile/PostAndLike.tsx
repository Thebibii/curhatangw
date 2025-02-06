import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserPost } from "@/hooks/reactQuery/posts/useGetUserPost.hook";
import LoadingState from "../LoadingState";
import PostCard from "../post/PostCard";
import SkeletonCard from "../skeleton/SkeletonCard";
import { User } from "@/types/user";
import { useUserLikedPosts } from "@/hooks/reactQuery/posts/useUserLikedPosts.hook";
import { Icons } from "../icons";

export default function PostAndLike({ user }: { user: User }) {
  const { data: post } = useGetUserPost({ username: user?.username });
  const { data: likedPost } = useUserLikedPosts({ username: user?.username });

  return (
    <Tabs defaultValue="posts" className="w-full ">
      <TabsList className="w-full justify-start h-auto bg-bw">
        <TabsTrigger
          value="posts"
          className="flex items-center gap-2 data-[state=active]:bg-bw px-6 font-semibold"
        >
          <Icons.FileTextIcon className="size-4" />
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="likes"
          className="flex items-center gap-2 data-[state=active]:bg-bw  px-6 font-semibold"
        >
          <Icons.HeartIcon className="size-4" />
          Likes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="mt-6">
        <div className="space-y-6">
          <LoadingState
            data={post?.data}
            loadingFallback={<SkeletonCard length={3} />}
          >
            {post?.data &&
              post?.data?.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  dbUserId={user?.id}
                  username={user?.username}
                />
              ))}
            {post?.data?.length === 0 && (
              <div className="text-center py-8 text-mtext">
                No posts to show
              </div>
            )}
          </LoadingState>
        </div>
      </TabsContent>

      <TabsContent value="likes" className="mt-6">
        <div className="space-y-6">
          <LoadingState
            data={likedPost?.data}
            loadingFallback={<SkeletonCard length={3} />}
          >
            {likedPost?.data?.length > 0 ? (
              likedPost?.data?.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  dbUserId={user?.id}
                  username={user?.username}
                />
              ))
            ) : (
              <div className="text-center py-8 text-mtext">
                No liked posts to show
              </div>
            )}
          </LoadingState>
        </div>
      </TabsContent>
    </Tabs>
  );
}
