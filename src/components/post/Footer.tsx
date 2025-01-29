import {
  HeartIcon,
  LogInIcon,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { SignInButton } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { useCreateComment } from "@/hooks/reactQuery/comments/useCreateComment";
import { toast } from "@/hooks/use-toast";
import { useGetCommentByPost } from "@/hooks/reactQuery/comments/useGetComments";
import LoadingState from "../LoadingState";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { useUserContext } from "@/contexts/UserContext";
import { useLikePost } from "@/hooks/reactQuery/posts/useLikePost";

export default function Footer({
  postId,
  count_comment,
  count_like,
  likes,
}: any) {
  const { user } = useUserContext();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const [optimisticLikes, setOptmisticLikes] = useState(count_like);

  const {
    data: comments,
    isLoading,
    refetch,
  } = useGetCommentByPost({ postId });

  const { mutate, isPending } = useCreateComment({
    onSuccess: () => {
      refetch();
      toast({
        title: "Comment created",
        description: "Your comment has been created successfully",
        duration: 1500,
      });
      setNewComment("");
    },
  });

  const { mutate: likePost } = useLikePost({
    postId,
    onSuccess: () => {
      setIsLiking(false);
    },
  });

  useEffect(() => {
    if (likes && user?.data?.id) {
      setHasLiked(likes.some((like: any) => like.userId === user?.data?.id));
    }
  }, [likes, user?.data?.id]);

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
        )}

        <Button
          variant="neutral"
          size="sm"
          className="text-muted-foreground gap-2 hover:text-blue-500"
          onClick={handleToggleComments}
        >
          <MessageCircleIcon
            className={`size-5 ${
              showComments && "fill-blue-500 text-blue-500"
            }`}
          />
          <span>{comments?.data?.length ?? count_comment}</span>
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4 pt-4 border-t ">
          <ScrollArea
            className={comments?.data?.length > 5 ? "h-72" : "h-full"}
          >
            <div className="space-y-4 pr-3">
              <LoadingState
                data={isLoading === false}
                loadingFallback={<Skeleton className="w-full h-5" />}
              >
                {/* DISPLAY COMMENTS */}
                {comments?.data?.map((comment: any) => (
                  <div key={comment.id} className="flex space-x-3 ">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={comment.author.image} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-center  gap-y-1">
                        <div className="flex gap-x-2">
                          <span className="font-medium text-sm ">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            @{comment.author.username}
                          </span>
                        </div>
                        <div className="gap-x-2 flex ">
                          <span className="text-sm text-muted-foreground">
                            ·
                          </span>
                          <span className="text-sm text-muted-foreground font-medium">
                            {formatDistanceToNow(new Date(comment.createdAt))}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
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
      )}
    </>
  );
}
