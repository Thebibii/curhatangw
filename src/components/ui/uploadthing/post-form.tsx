"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/hooks/reactQuery/posts/useCreatePost";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Label } from "@radix-ui/react-label";

const { uploadFiles } = generateReactHelpers<OurFileRouter>();

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  content: z
    .string()
    .min(2, { message: "Content must be at least 2 characters." }),
  image: z.custom<File>((file) => file instanceof File, {
    message: "You must upload an image.",
  }),
});
export default function PostForm() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useCreatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPostByUserId.post"] });
      form.reset();

      setFile(null);
      setFilePreview("");
      toast({
        title: "Post created!",
        description: "We've created your post for you.",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, content } = values;
    if (!file) {
      return;
    }

    const uploadResponse = await uploadFiles("postImage", {
      files: [file],
    });
    mutate({ content, image: uploadResponse[0].url || "" });

    const formData = new FormData();
    form.setValue("image", file, { shouldDirty: true });
  }
  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file.size > 1024 * 3000) {
        return alert("Ukuran file terlalu besar");
      }

      setFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-shrink"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormDescription>
                Provide a descriptive title for your post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Input placeholder="Enter content" {...field} />
              </FormControl>
              <FormDescription>The main content of your post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="mx-auto md:w-full">
              <FormLabel htmlFor="image">Upload your image</FormLabel>
              <FormControl className="bg-center bg-contain w-56 h-40 ">
                <div
                  className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground relative"
                  style={{
                    backgroundImage: `url(${filePreview})`,
                  }}
                >
                  {filePreview && (
                    <div
                      className={`"absolute inset-0 bg-black/80 ${
                        filePreview ?? "hidden"
                      } transition-all inline-flex items-center group-hover:flex justify-center"`}
                    >
                      <Button
                        variant="noShadow"
                        onClick={() => {
                          setFile(null);
                          setFilePreview("");
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={fileChangeHandler}
                    className="hidden"
                    id="image"
                    multiple={false}
                  />

                  <Label
                    htmlFor="image"
                    className={`"text-sm" ${filePreview && "hidden"}`}
                  >
                    Click here or drag an image to upload it
                  </Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="neutral">
          Submit
        </Button>
      </form>
    </Form>
  );
}
