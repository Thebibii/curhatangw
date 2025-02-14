"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "@/hooks/reactQuery/posts/useDeletePost.hook";
import { toast } from "@/hooks/use-toast";
import { QueryFilters, useQueryClient } from "@tanstack/react-query";
import { useDeletePhoto } from "@/hooks/useDeletePhoto.hook";
import { Icons } from "./icons";
import { PostsInfinite } from "@/types/post";

interface DeleteAlertDialogProps {
  postId: string;
  title?: string;
  imageUrl?: string;
  description?: string;
}

export function DeleteAlertDialog({
  postId,
  title = "Delete Post",
  imageUrl,
  description = "This action cannot be undone.",
}: DeleteAlertDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: deletePhoto } = useDeletePhoto();
  const { isPending, mutate, isSuccess } = useDeletePost({
    postId,
    onSuccess: async (body: any) => {
      const queryFilter: QueryFilters = {
        queryKey: ["get.post"],
      };

      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData: PostsInfinite) => {
        if (!oldData) return;

        return {
          pageParams: oldData?.pageParams,
          pages: oldData?.pages?.map((page: any) => ({
            nextCursor: page.nextCursor,
            data: page.data.filter((p: any) => p.id !== body.data.id),
          })),
        };
      });
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
        duration: 1500,
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="neutral"
          size="sm"
          className="text-muted-foreground hover:text-red-500 -mr-2"
          disabled={isPending}
        >
          {isPending ? (
            <Icons.Loader2Icon className="size-4 animate-spin" />
          ) : (
            <Icons.Trash2Icon className="size-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (imageUrl) {
                deletePhoto({ imageUrl });
              }
              mutate();
            }}
            className="bg-red-500 hover:bg-red-600"
            disabled={isSuccess}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
