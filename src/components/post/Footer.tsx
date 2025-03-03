import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SignInButton } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { useCreateComment } from "@/hooks/reactQuery/comments/useCreateComment.hook";
import { toast } from "@/hooks/use-toast";
import { useGetCommentByPost } from "@/hooks/reactQuery/comments/useGetComments.hook";
import LoadingState from "../state/LoadingState";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "@/contexts/UserContext";
import { useLikePost } from "@/hooks/reactQuery/posts/useLikePost";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { Icons } from "../icons";
import { filterBadWord } from "@/helper/sensor.helper";
import SettingComment from "./SettingComment";
import CommentSkeleton from "../skeleton/CommentSkeleton";
import EmptyState from "../state/EmptyState";
import { CommentsApiResponse } from "@/types/comment";
import { User } from "@prisma/client";

export default function Footer({
  postId,
  count_comment,
  count_like,
  likes,
  username,
}: any) {
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [mentionUserIds, setMentionUserIds] = useState<User["id"][]>([]);

  const [optimisticLikes, setOptmisticLikes] = useState(count_like);

  const {
    data: comments,
    isLoading,
    refetch,
  } = useGetCommentByPost({ postId });

  const { mutate, isPending } = useCreateComment({
    postId,
    onSuccess: async (newComment: CommentsApiResponse) => {
      refetch();
      /* const queryKey: QueryKey = ["get.comment", postId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData(queryKey, (oldData: CommentsApiResponse) => {
        const firstPage = oldData?.data;

        if (firstPage) {
          return {
            data: [...firstPage, newComment.data],
            success: true,
            ...oldData.data.slice(1),
          };
        }
      }); */

      toast({
        title: "Comment created",
        description: "Your comment has been created successfully",
        duration: 1500,
      });
      setNewComment("");
      setNewComment("");
    },
  });

  const { mutate: likePost } = useLikePost({
    postId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.user.likes", username] });
      queryClient.invalidateQueries({ queryKey: ["get.post", username] });
      setIsLiking(false);
    },
  });

  useEffect(() => {
    if (likes && user?.data?.id) {
      setHasLiked(likes?.some((like: any) => like?.userId === user?.data?.id));
    }
  }, [likes]);

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      mutate({ postId, content: newComment });
    } catch (error) {
      console.error("Failed to create comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleToggleComments = async () => {
    setShowComments((prev) => !prev);
    if (!showComments) {
      await refetch();
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptmisticLikes((prev: any) => prev + (hasLiked ? -1 : 1));
      likePost();
    } catch (error) {
      setOptmisticLikes(count_like);
      setHasLiked(likes.some((like: any) => like.userId === user?.data?.id));
    }
  };

  return (
    <>
      <div className="flex items-center pt-2 space-x-4">
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
          onClick={handleToggleComments}
        >
          <Icons.MessageCircleIcon
            className={`size-5 ${
              showComments && "fill-blue-500 text-blue-500"
            }`}
          />
          <span>{comments?.data?.length ?? count_comment}</span>
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4 ">
          <ScrollArea
            className={
              comments?.data?.length > 5 ? "h-72 border-y" : "h-full border-t"
            }
          >
            <div className="space-y-4 pr-3 py-2">
              <LoadingState
                data={isLoading === false}
                loadingFallback={<CommentSkeleton />}
              >
                <EmptyState data={comments?.data} message={comments?.message}>
                  {comments?.data?.map((comment: any) => (
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
                              content={comment?.content}
                              postId={postId}
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

          {user?.data ? (
            <div className="flex space-x-3">
              <Avatar className="size-8 flex-shrink-0">
                <AvatarImage src={user?.data?.image} />
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    className="flex items-center gap-2"
                    disabled={isPending || !newComment.trim() || isCommenting}
                  >
                    {isPending ? (
                      "Commenting..."
                    ) : (
                      <>
                        <Icons.SendIcon className="size-4" />
                        Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
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
        </div>
      )}
    </>
  );
}
