"use client";

import FollowAndUnfollow from "@/components/FollowAndUnfollow";
import { Icons } from "@/components/icons";
import LoadingState from "@/components/state/LoadingState";
import DialogEditProfile from "@/components/profile/DialogEditProfile";
import PostAndLike from "@/components/profile/PostAndLike";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/contexts/UserContext";
import { useGetUserByName } from "@/hooks/reactQuery/user/useGetUserByName";
import { SignInButton } from "@clerk/nextjs";
import { format, formatDate, formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { useState } from "react";

function ProfilePageClient({ username }: any) {
  const { user: currentUser } = useUserContext();
  const { data: user, isPending } = useGetUserByName({ username });
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (user?.error) return notFound();

  const isOwnProfile = currentUser?.data?.id === user?.data?.id;

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
                  <LoadingState
                    data={!isPending}
                    loadingFallback={<Skeleton className="w-full h-10 mt-4" />}
                  >
                    <SignInButton mode="modal">
                      <Button className="w-full mt-4">Follow</Button>
                    </SignInButton>
                  </LoadingState>
                ) : isOwnProfile ? (
                  <Button
                    className="w-full mt-4"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Icons.EditIcon className="size-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <LoadingState
                    data={!isPending}
                    loadingFallback={<Skeleton className="w-full h-10 mt-4" />}
                  >
                    <FollowAndUnfollow
                      userId={user?.data?.id}
                      className="w-full mt-4"
                      variant={`${
                        user?.data?.isFollowing ? "neutral" : "noShadow"
                      }`}
                      size={"default"}
                      username={user?.data?.username}
                      isFollowing={user?.data?.isFollowing}
                    />
                  </LoadingState>
                )}

                {/* LOCATION & WEBSITE */}
                <div className="w-full mt-6 space-y-2 text-sm">
                  {user?.data?.location && (
                    <div className="flex items-center text-mtext">
                      <Icons.MapPinIcon className="size-4 mr-2" />
                      {user?.data?.location}
                    </div>
                  )}
                  {user?.data?.website && (
                    <div className="flex items-center text-mtext">
                      <Icons.LinkIcon className="size-4 mr-2" />
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
                    <Icons.CalendarIcon className="size-4 mr-2" />
                    <LoadingState
                      data={user}
                      loadingFallback={<Skeleton className="w-1/3 h-4" />}
                    >
                      Joined{" "}
                      {user?.data?.createdAt &&
                        format(new Date(user.data.createdAt), "MMMM yyyy")}
                    </LoadingState>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <PostAndLike user={user?.data} />

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
