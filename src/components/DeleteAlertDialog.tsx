"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePhoto } from "@/hooks/useDeletePhoto.hook";

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
  // deletePhoto({ imageUrl });
  const { isPending, mutate, isSuccess } = useDeletePost({
    postId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.post"] });
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
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <Trash2Icon className="size-4" />
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
