"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/stores/posts/useCreatePost";
import { on } from "events";
import { useQueryClient } from "@tanstack/react-query";
// import { createPost } from "@/actions/post.action";
// import ImageUpload from "./ImageUpload";

function CreatePost() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const { mutate } = useCreatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.post"] });
      // reset the form
      setContent("");
      setImageUrl("");
      setShowImageUpload(false);

      toast({
        description: "Post created successfully",
      });
    },
  });
  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    mutate({ content, image: imageUrl });
    setIsPosting(true);
    try {
      //   const result = await createPost(content, imageUrl);
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        description: "Failed to create post",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none  focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              {/* <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              /> */}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="neutral"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CreatePost;
