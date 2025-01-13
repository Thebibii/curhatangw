"use client";

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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useCreatePost } from "@/stores/posts/useCreatePost";
import { useGetPostByUserId } from "@/stores/posts/useGetPostByUserId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema definition
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  content: z
    .string()
    .min(2, { message: "Content must be at least 2 characters." }),
});

// Form Component
function PostForm({ onSubmit }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        suppressContentEditableWarning
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

// Table Component
function PostTable({ posts }) {
  return (
    <Table>
      <TableCaption>A list of your recent posts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Content</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts?.map((post: any) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.content}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Main Page Component
export default function Page() {
  const queryClient = useQueryClient();
  const { mutate } = useCreatePost({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPostByUserId.post"] });
      toast({
        title: "Post created!",
        description: "We've created your post for you.",
      });
    },
  });

  async function handleSubmit(values: any) {
    mutate(values);
  }

  const { data } = useGetPostByUserId();

  return (
    <main className="flex min-h-screen justify-between p-24 gap-x-8">
      <div className="flex flex-col items-center justify-between">
        <PostForm onSubmit={handleSubmit} />
      </div>
      <div>
        <PostTable posts={data?.data} />
      </div>
    </main>
  );
}
