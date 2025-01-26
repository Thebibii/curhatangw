"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/hooks/reactQuery/posts/useCreatePost";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@/contexts/UserContext";
import { Label } from "./ui/label";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

function CreatePost() {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // const [filePreview, setFilePreview] = useState<string | null>(null);

  const { mutate, isPending } = useCreatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.post"] });
      setContent("");
      setImageUrl("");
      setShowImageUpload(false);
      setFile(null);

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

      mutate({ content, image: uploadedImageUrl });
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

      if (file.size > 1024 * 3000) {
        return toast({
          title: "Notification",
          description: "Image 4 MB",
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
                <Textarea
                  name="content"
                  placeholder="What's on your mind?"
                  className="min-h-[100px] resize-none  focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isPosting}
                />
              </div>

              {(showImageUpload || imageUrl) && (
                <div className="border rounded-lg p-4">
                  <div
                    className={`mt-2 flex flex-col group  items-center overflow-hidden  justify-center rounded-lg border border-dashed  px-6 py-10 text-center relative ${
                      imageUrl && `h-80 bg-contain bg-center bg-no-repeat`
                    }`}
                    style={
                      imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}
                    }
                    tabIndex={0}
                  >
                    {imageUrl && (
                      <div className="absolute inset-0 bg-black/60 hidden transition-all flex items-center group-hover:flex justify-center">
                        <Button
                          variant="noShadow"
                          onClick={() => {
                            setFile(null);
                            setImageUrl("");
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      className={`mx-auto mb-8 block h-12 w-12 align-middle text-white  ${
                        imageUrl && "hidden"
                      }`}
                      data-ut-element="upload-icon"
                      data-state="ready"
                    >
                      <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765a4.5 4.5 0 0 1 8.302-3.046a3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <Label
                      htmlFor="image"
                      className={`absolute mt-4 w-full h-full flex cursor-pointer items-center justify-center text-sm font-semibold leading-6 text-white/80 hover:text-blue-500  ${
                        imageUrl && "hidden"
                      }`}
                    >
                      Choose a file for image
                    </Label>
                    <input
                      className="hidden"
                      accept="image/*"
                      type="file"
                      onChange={fileChangeHandler}
                      multiple={false}
                      id="image"
                    />
                    <div
                      className={`m-0 h-[1.25rem] text-xs leading-5 text-bg  ${
                        imageUrl && "hidden"
                      }`}
                      data-ut-element="allowed-content"
                      data-state="ready"
                    >
                      Image (4MB)
                    </div>
                  </div>
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
      ) : null}
    </>
  );
}
export default CreatePost;
