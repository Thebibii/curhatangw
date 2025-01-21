"use client";

import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useGetPost } from "@/hooks/reactQuery/posts/useGetPost";
import LoadingState from "../LoadingState";
import { Skeleton } from "../ui/skeleton";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import Footer from "./Footer";
import { useUserContext } from "@/contexts/UserContext";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useState } from "react";

function PostCard() {
  const { data, isLoading } = useGetPost();
  const { user } = useUserContext();
  const [isDeleting, setIsDeleting] = useState(false);

  /* const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptmisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  }; */

  return (
    <LoadingState
      data={data?.data || isLoading === false}
      loadingFallback={<Skeleton className="w-full h-36" />}
    >
      {data?.data.map((post: any) => (
        <Card className="overflow-hidden bg-bw" key={post.id}>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex space-x-3 sm:space-x-4">
                {/* <Link href={`/profile/${post.author.username}`}> */}
                <Link href="#">
                  <Avatar className="size-8 sm:w-10 sm:h-10">
                    <AvatarImage src={post.author.image} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>

                {/* POST HEADER & TEXT CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                      <Link
                        // href={`/profile/${post.author.username}`}
                        href="#"
                        className="font-semibold truncate"
                      >
                        {post.author.name}
                      </Link>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {/* <Link href={`/profile/${post.author.username}`}> */}
                        <Link href="#">{post.author.username}</Link>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(post.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    {/* Check if current user is the post author */}
                    {user?.data?.id === post.author.id && (
                      <DeleteAlertDialog postId={post.id} />
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foreground break-words">
                    {post.content}
                  </p>
                </div>
              </div>

              {/* POST IMAGE */}
              {post.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* LIKE & COMMENT BUTTONS */}
              <Footer postId={post.id} count_comment={post._count.comments} />

              {/* COMMENTS SECTION */}
            </div>
          </CardContent>
        </Card>
      ))}
    </LoadingState>
  );
}
export default PostCard;
