import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import Footer from "./Footer";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import Image from "next/image";

function PostCard({ post, dbUserId }: any) {
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
    <Card className="overflow-hidden bg-bw">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="w-10 h-10 inline-flex items-center justify-center border">
                <AvatarImage src={post.author.image} />
                <AvatarFallback>
                  {post.author.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      {post.author.username}
                    </Link>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>

                {dbUserId === post.author.id && (
                  <DeleteAlertDialog postId={post.id} imageUrl={post.image} />
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
              {post.image && (
                <div className="rounded-lg overflow-hidden mt-2">
                  <Image
                    width={500}
                    height={500}
                    priority
                    decoding="async"
                    src={post.image}
                    alt="Post content"
                    className="h-full w-fit object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* LIKE & COMMENT BUTTONS */}
          <Footer
            postId={post.id}
            count_comment={post._count.comments}
            count_like={post._count.likes}
            likes={post.likes}
          />

          {/* COMMENTS SECTION */}
        </div>
      </CardContent>
    </Card>
  );
}
export default PostCard;
