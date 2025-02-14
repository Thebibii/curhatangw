"use client";
import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { useDeleteComment } from "@/hooks/reactQuery/comments/useDeleteComment.hook";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useUpdateComment } from "@/hooks/reactQuery/comments/useUpdateComment.hook";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { CommentResponse, CommentsApiResponse } from "@/types/comment";
import { DetailPost } from "@/types/detail-post";

const formEditSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 characters." }),
});

const formDeleteSchema = z.object({
  commentId: z.string(),
});

type TSettingComment = {
  commentId: string;
  refetch?: () => void;
  content: string;
  postId: string;
};

type TModal = {
  openDeleteDialog?: boolean | undefined;
  setOpenDeleteDialog?: (
    value: React.SetStateAction<boolean>
  ) => void | undefined;
  openEditDialog?: boolean | undefined;
  setOpenEditDialog?: (
    value: React.SetStateAction<boolean>
  ) => void | undefined;
  commentId: string;
  refetch?: () => void;
  content?: string;
  postId: string;
};

export default function SettingComment({
  commentId,
  refetch,
  content,
  postId,
}: TSettingComment) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <>
      <DeleteCommentDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        commentId={commentId}
        refetch={refetch}
        postId={postId}
      />
      <EditCommentDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        commentId={commentId}
        refetch={refetch}
        postId={postId}
        content={content}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="w-4 aspect-square cursor-pointer hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="left"
          className="bg-bw z-[1000]"
          align="start"
        >
          <DropdownMenuItem
            className="cursor-pointer bg-bw"
            onClick={() => setOpenEditDialog(true)}
          >
            Edit Komen
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="cursor-pointer focus:bg-destructive focus:text-bw bg-bw"
          >
            Hapus Komen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

const DeleteCommentDialog = ({
  openDeleteDialog,
  setOpenDeleteDialog,
  commentId,
  postId,
  refetch,
}: TModal) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteComment({
    onSuccess: async ({
      data: body,
    }: {
      data: CommentResponse | DetailPost;
    }) => {
      refetch?.();
      /* const queryKeys: QueryKey[] = [ // untuk memperbarui cache
        ["get.detail.post", postId],
        ["get.comment", postId],
      ];

      await Promise.all(
        queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey }))
      );

      queryKeys.forEach((queryKey) => {
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return null;

          if (queryKey[0] === "get.detail.post") {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                comments: oldData.data.comments?.filter(
                  (c: any) => c.id !== body.id
                ),
                _count: {
                  ...oldData.data._count,
                  comments: oldData.data._count.comments - 1,
                },
              },
            };
          }

          if (queryKey[0] === "get.comment") {
            const comments = oldData.data?.filter((c: any) => c.id !== body.id);

            return {
              ...oldData,
              data: comments ?? [],
              message:
                comments.length === 0 ? "No comments yet" : oldData.message,
            };
          }

          return oldData;
        });
      }); */

      setOpenDeleteDialog?.(false);
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully",
        duration: 1500,
      });
    },
  });
  const form = useForm<z.infer<typeof formDeleteSchema>>({
    resolver: zodResolver(formDeleteSchema),
    mode: "onChange",
    defaultValues: {
      commentId: commentId,
    },
  });
  async function onDelete(values: z.infer<typeof formDeleteSchema>) {
    mutate({ commentId: values.commentId });
  }
  return (
    <AlertDialog open={openDeleteDialog}>
      <AlertDialogContent className="bg-bw">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            comment and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onDelete)}>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setOpenDeleteDialog?.(false)}
                disabled={isPending}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                type="submit"
                className="bg-destructive text-bw"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditCommentDialog = ({
  openEditDialog,
  setOpenEditDialog,
  commentId,
  refetch,
  content,
}: TModal) => {
  const form = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
    mode: "onChange",
    defaultValues: {
      content: content,
    },
  });

  const { mutate, isPending } = useUpdateComment({
    onSuccess: () => {
      refetch?.();
      setOpenEditDialog?.(false);
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully",
        duration: 1500,
      });
    },
  });
  async function onSubmit(values: z.infer<typeof formEditSchema>) {
    mutate({ commentId, content: values.content });
  }
  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent className="bg-bw">
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
          <DialogDescription>
            Make changes to your comment and save the changes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-shrink"
            encType="multipart/form-data"
          >
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button
                    variant="neutral"
                    onClick={() => form.reset()}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
