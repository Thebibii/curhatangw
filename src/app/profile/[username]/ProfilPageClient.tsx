"use client";

import LoadingState from "@/components/LoadingState";
import DialogEditProfile from "@/components/profile/DialogEditProfile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useUserContext } from "@/contexts/UserContext";
import { useProfileByUsername } from "@/hooks/reactQuery/profile/useProfileByUsername";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
} from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
// import toast from "react-hot-toast";

// type User = Awaited<ReturnType<typeof getProfileByUsername>>;
// type Posts = Awaited<ReturnType<typeof getUserPosts>>;

// interface ProfilePageClientProps {
//   user: NonNullable<User>;
//   posts: Posts;
//   likedPosts: Posts;
//   isFollowing: boolean;
// }

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  username,
  posts,
}: any) {
  const { user: currentUser } = useUser();
  const { data: user } = useProfileByUsername({ username });

  if (user?.error) return notFound();

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  //   const handleFollow = async () => {
  //     if (!currentUser) return;

  //     try {
  //       setIsUpdatingFollow(true);
  //       await toggleFollow(user?.data?.id);
  //       setIsFollowing(!isFollowing);
  //     } catch (error) {
  //       toast.error("Failed to update follow status");
  //     } finally {
  //       setIsUpdatingFollow(false);
  //     }
  //   };

  const isOwnProfile =
    currentUser?.emailAddresses[0].emailAddress === user?.data?.username ||
    currentUser?.emailAddresses[0].emailAddress.split("@")[0] ===
      user?.data?.username;

  //   const formattedDate = format(new Date(user?.data?.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-lg mx-auto">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <LoadingState
                  data={user?.data}
                  loadingFallback={
                    <Skeleton className="w-24 h-24 rounded-full animate-pulse" />
                  }
                >
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.data?.image ?? "/avatar.png"} />
                  </Avatar>
                </LoadingState>
                <LoadingState
                  data={user?.data}
                  loadingFallback={<Skeleton className="w-1/3 h-4 mt-4" />}
                >
                  <h1 className="mt-4 text-2xl font-bold">
                    {user?.data?.name ?? user?.data?.username}
                  </h1>
                </LoadingState>
                <LoadingState
                  data={user?.data}
                  loadingFallback={
                    <Skeleton className="w-1/4 h-4 mt-2 text-mtext" />
                  }
                >
                  <p className="text-mtext">@{user?.data?.username}</p>
                </LoadingState>
                <LoadingState
                  data={user?.data}
                  loadingFallback={<Skeleton className="w-1/2 h-4 mt-2" />}
                >
                  <p className="mt-2 text-sm">{user?.data?.bio}</p>
                </LoadingState>

                {/* PROFILE STATS */}
                <div className="w-full mt-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="font-semibold">
                        {user?.data?._count.following.toLocaleString() ?? 0}
                      </div>
                      <div className="text-sm text-mtext">Following</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user?.data?._count.followers.toLocaleString() ?? 0}
                      </div>
                      <div className="text-sm text-mtext">Followers</div>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <div className="font-semibold">
                        {user?.data?._count.posts.toLocaleString() ?? 0}
                      </div>
                      <div className="text-sm text-mtext">Posts</div>
                    </div>
                  </div>
                </div>

                {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
                {!currentUser ? (
                  <SignInButton mode="modal">
                    <Button className="w-full mt-4">Follow</Button>
                  </SignInButton>
                ) : isOwnProfile ? (
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-4"
                    // onClick={handleFollow}
                    disabled={isUpdatingFollow}
                    variant={isFollowing ? "neutral" : "default"}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}

                {/* LOCATION & WEBSITE */}
                <div className="w-full mt-6 space-y-2 text-sm">
                  {user?.data?.location && (
                    <div className="flex items-center text-mtext">
                      <MapPinIcon className="size-4 mr-2" />
                      {user?.data?.location}
                    </div>
                  )}
                  {user?.data?.website && (
                    <div className="flex items-center text-mtext">
                      <LinkIcon className="size-4 mr-2" />
                      <a
                        href={
                          user?.data?.website.startsWith("http")
                            ? user?.data?.website
                            : `https://${user?.data?.website}`
                        }
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user?.data?.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center text-mtext">
                    <CalendarIcon className="size-4 mr-2" />
                    Joined formattedDate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <Tabs defaultValue="posts" className="w-full">
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
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} dbUserId={user?.data?.id} />
                ))
              ) : (
                <div className="text-center py-8 text-mtext">
                  No posts yet
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
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
          </TabsContent>
        </Tabs> */}

        <DialogEditProfile
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          user={user?.data}
        />
      </div>
    </div>
  );
}
export default ProfilePageClient;
