"use client";

import { useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/hooks/reactQuery/posts/useCreatePost";
import { QueryFilters, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@/contexts/UserContext";
import { generateReactHelpers } from "@uploadthing/react";
import { Icons } from "../../icons";
import UploadImage from "../../UploadImage";
import { OurFileRouter } from "@/helper/uploadthing.helper";
import { Label } from "../../ui/label";
import InputTags from "./InputTags";
import { Tag } from "@prisma/client";
import { ApiPostsInfinite, PostInfinite } from "@/types/post";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

function CreatePost() {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);

  const { mutate, isPending } = useCreatePost({
    onSuccess: async ({ data: newPost }: { data: PostInfinite }) => {
      queryClient.invalidateQueries({ queryKey: ["get.post"], exact: true });
      setContent("");
      setImageUrl("");
      setShowImageUpload(false);
      setFile(null);
      setTags([]);

      /*  const queryFilter: QueryFilters = { // untuk memperbarui cache
        queryKey: ["get.post"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData: ApiPostsInfinite) => {
        const firstPage = oldData?.pages[0];
        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                data: [newPost.data, ...firstPage.data],
                nextPage: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      }); */

      toast({
        title: "Notification",
        description: "Post created successfully",
        duration: 2000,
      });
    },
  });
  const handleSubmit = async () => {
    if (!content.trim() && !file) return;

    setIsPosting(true);
    try {
      let uploadedImageUrl = "";
      if (file) {
        const uploadResponse = await uploadFiles("postImage", {
          files: [file],
        });
        uploadedImageUrl = uploadResponse?.[0]?.url || "";
      }

      mutate({ content, image: uploadedImageUrl, tags });
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        description: "Failed to create post",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file?.size > 1024 * 2000) {
        return toast({
          title: "Notification",
          description: "Image size should be less than 2MB",
        });
      }

      setFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {user?.data ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Avatar className="w-10 h-10 inline-flex items-center justify-center">
                  <AvatarImage src={user?.data.image} />
                  <AvatarFallback className="border border-ring">
                    {user?.data.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full space-y-4">
                  <div className="flex flex-col space-y-2 ">
                    <p className="font-semibold text-sm"># Tags</p>
                    <InputTags
                      setTagInput={setTagInput}
                      tagInput={tagInput}
                      tags={tags}
                      setTags={setTags}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="content" className="font-semibold">
                      Message
                    </Label>
                    <Textarea
                      name="content"
                      id="content"
                      placeholder="What's on your mind?"
                      className="min-h-[100px] resize-none   focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isPosting || isPending}
                    />
                  </div>
                </div>
              </div>

              {(showImageUpload || imageUrl) && (
                <div className="border rounded-lg p-4">
                  <UploadImage
                    imageUrl={imageUrl}
                    fileChangeHandler={fileChangeHandler}
                    setFile={setFile}
                    setImageUrl={setImageUrl}
                    isDisabled={isPending || isPosting}
                  />
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="neutral"
                    size="sm"
                    className=" hover:text-primary"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                    disabled={isPosting}
                  >
                    <Icons.ImageIcon className="size-4 mr-2" />
                    Photo
                  </Button>
                </div>
                <Button
                  className={`"flex items-center" ${
                    isPending && "opacity-50 animate-pulse "
                  }`}
                  onClick={handleSubmit}
                  variant="neutral"
                  disabled={
                    isPending || isPosting || (!content.trim() && !imageUrl)
                  }
                >
                  {isPending || isPosting ? (
                    <>
                      <Icons.Loader2Icon className="size-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Icons.SendIcon className="size-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
export default CreatePost;
