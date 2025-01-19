"use client";
import { LogInIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { useCreateComment } from "@/hooks/reactQuery/comments/useCreateComment";
import { toast } from "@/hooks/use-toast";
import { useGetCommentByPost } from "@/hooks/reactQuery/comments/useGetComments";
import LoadingState from "../LoadingState";
import { Skeleton } from "../ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

export default function Footer({ postId, count_comment }: any) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: comments, isLoading } = useGetCommentByPost({ postId });

  const { mutate, isPending } = useCreateComment({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.comment", postId] });
      toast({
        title: "Comment created",
        description: "Your comment has been created successfully",
      });
      setNewComment("");
    },
  });
  /*   const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptmisticLikes] = useState(post._count.likes); */

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

  return (
    <>
      <div className="flex items-center pt-2 space-x-4">
        {/* {user ? (
          <Button
            variant="neutral"
            size="sm"
            className={`text-muted-foreground gap-2 ${
              hasLiked
                ? "text-red-500 hover:text-red-600"
                : "hover:text-red-500"
            }`}
            onClick={handleLike}
          >
            {hasLiked ? (
              <HeartIcon className="size-5 fill-current" />
            ) : (
              <HeartIcon className="size-5" />
            )}
            <span>{optimisticLikes}</span>
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button
              variant="neutral"
              size="sm"
              className="text-muted-foreground gap-2"
            >
              <HeartIcon className="size-5" />
              <span>{optimisticLikes}</span>
            </Button>
          </SignInButton>
        )} */}

        <Button
          variant="neutral"
          size="sm"
          className="text-muted-foreground gap-2 hover:text-blue-500"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageCircleIcon
            className={`size-5 ${
              showComments ? "fill-blue-500 text-blue-500" : ""
            }`}
          />
          <span>{count_comment}</span>
        </Button>
      </div>

      {showComments && (
        <LoadingState
          data={comments?.data}
          loadingFallback={<Skeleton className="w-fit" />}
        >
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-4">
              {/* DISPLAY COMMENTS */}
              {comments.data.map((comment: any) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-sm">
                        {comment.author.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{comment.author.username}
                      </span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                    <p className="text-sm break-words">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {user ? (
              <div className="flex space-x-3">
                <Avatar className="size-8 flex-shrink-0">
                  <AvatarImage src={user?.imageUrl || "/avatar.png"} />
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
                        "Posting..."
                      ) : (
                        <>
                          <SendIcon className="size-4" />
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
                    <LogInIcon className="size-4" />
                    Sign in to comment
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </LoadingState>
      )}
    </>
  );
}
