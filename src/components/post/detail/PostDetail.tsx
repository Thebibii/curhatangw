"use client";
import Link from "next/link";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { filterBadWord } from "@/helper/sensor.helper";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/state/LoadingState";
import EmptyState from "@/components/state/EmptyState";
import CommentSkeleton from "@/components/skeleton/CommentSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserContext } from "@/contexts/UserContext";
import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";
import { Icons } from "@/components/icons";
import SettingComment from "../SettingComment";
import { Input } from "@/components/ui/input";
import CreateComment from "./CreateComment";

type PostDetailProps = {
  post: any;
  dbUserId: string;
  username?: string | null;
  isLoading?: boolean;
  refetch?: () => void;
  className?: string;
};

function PostDetail({
  post,
  dbUserId,
  username = null,
  isLoading,
  refetch,
  className,
}: PostDetailProps) {
  const { user } = useUserContext();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [optimisticLikes, setOptmisticLikes] = useState(post?._count?.likes);
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev: any) => prev + (hasLiked ? -1 : 1));
      // likePost();
    } catch (error) {
      // setOptmisticLikes(count_like);
      // setHasLiked(likes.some((like: any) => like.userId === user?.data?.id));
    }
  };

  return (
    <Card className={`overflow-hidden bg-bw w-full ${className}`}>
      <CardContent className="p-4 sm:p-6 ">
        <div className="space-y-4 ">
          <div className="flex space-x-3 sm:space-x-4 items-center ">
            <Link href={`/profile/${post?.author?.username}`}>
              <Avatar className="w-10 h-10  border">
                <AvatarImage
                  src={post?.author?.image}
                  width={100}
                  height={100}
                />
                <AvatarFallback>
                  {post?.author?.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <Link
                    href={`/profile/${post?.author?.username}`}
                    className="font-semibold truncate"
                  >
                    {post?.author?.username}
                  </Link>
                  <span>•</span>
                  <Button
                    size="sm"
                    variant="noShadow"
                    className="bg-bw text-sm border-none text-main p-0"
                  >
                    Follow
                  </Button>
                </div>

                {dbUserId === post?.author?.id && (
                  <DeleteAlertDialog postId={post?.id} imageUrl={post?.image} />
                )}
              </div>
            </div>
          </div>

          <ScrollArea className="border-y h-[50vh]">
            <div className="space-y-4 py-2  pr-6">
              <LoadingState
                data={isLoading === false}
                loadingFallback={<CommentSkeleton />}
              >
                <div className="flex space-x-3 ">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={post?.author.image} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-x-2 ">
                        <span className="font-medium text-sm">
                          {post?.author.name}
                        </span>
                        <span className="text-sm text-secondary">
                          @{post?.author.username}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm break-words">
                      {filterBadWord(post?.content)}
                    </p>
                    <span className="text-xs text-secondary">
                      {formatDistanceToNow(new Date(post?.createdAt))}
                    </span>
                  </div>
                </div>
                <EmptyState data={post?.comments} message="No comments yet">
                  {post?.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex space-x-3 ">
                      <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage src={comment.author.image} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-x-2 ">
                            <span className="font-medium text-sm">
                              {comment.author.name}
                            </span>
                            <span className="text-sm text-secondary">
                              @{comment.author.username}
                            </span>
                            <span className="text-sm text-secondary">·</span>
                            <span className="text-sm text-secondary">
                              {formatDistanceToNow(new Date(comment.createdAt))}
                            </span>
                          </div>
                          {user?.data?.username === comment.author.username && (
                            <SettingComment
                              commentId={comment.id}
                              refetch={refetch}
                              content={comment.content}
                              postId={post.id}
                            />
                          )}
                        </div>
                        <p className="text-sm break-words">
                          {filterBadWord(comment.content)}
                        </p>
                      </div>
                    </div>
                  ))}
                </EmptyState>
              </LoadingState>
            </div>
          </ScrollArea>
          <div className="flex items-center  space-x-4 ">
            {user ? (
              <Button
                variant="neutral"
                size="sm"
                className={` gap-2 ${
                  hasLiked
                    ? "text-red-500 hover:text-red-600"
                    : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                {hasLiked ? (
                  <Icons.HeartIcon className="size-5 fill-current" />
                ) : (
                  <Icons.HeartIcon className="size-5" />
                )}
                <span>{optimisticLikes}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="neutral" size="sm" className=" gap-2">
                  <Icons.HeartIcon className="size-5" />
                  <span>{optimisticLikes}</span>
                </Button>
              </SignInButton>
            )}
            <Button
              variant="neutral"
              size="sm"
              className=" gap-2 hover:text-blue-500"
            >
              <Icons.MessageCircleIcon className="size-5" />
              <span>{post?._count?.comments}</span>
            </Button>
          </div>
        </div>
        {user?.data ? (
          <div className="flex space-x-3  items-center mt-8">
            <Avatar className="flex-shrink-0">
              <AvatarImage src={user?.data?.image} />
            </Avatar>
            <CreateComment postId={post.id} refetch={refetch} />
          </div>
        ) : (
          <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
            <SignInButton mode="modal">
              <Button variant="neutral" className="gap-2">
                <Icons.LogInIcon className="size-4" />
                Sign in to comment
              </Button>
            </SignInButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default PostDetail;
