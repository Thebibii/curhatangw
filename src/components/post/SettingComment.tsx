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
  AlertDialogAction,
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

const formEditSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment must be at least 1 characters." }),
});

const formDeleteSchema = z.object({
  commentId: z.string(),
});

export default function SettingComment({
  commentId,
  refetch,
  content,
}: {
  commentId: string;
  refetch?: () => void;
  content: string;
}) {
  console.log(content);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <>
      <DeleteCommentDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        commentId={commentId}
        refetch={refetch}
      />
      <EditCommentDialog
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        commentId={commentId}
        refetch={refetch}
        content={content}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="w-4 aspect-square cursor-pointer hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" className="bg-bw" align="start">
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
  refetch,
}: any) => {
  const { mutate, isPending } = useDeleteComment({
    onSuccess: () => {
      refetch();
      setOpenDeleteDialog(false);
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
                onClick={() => setOpenDeleteDialog(false)}
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
}: any) => {
  const form = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
    mode: "onChange",
    defaultValues: {
      content: content,
    },
  });

  const { mutate, isPending } = useUpdateComment({
    onSuccess: () => {
      refetch();
      setOpenEditDialog(false);
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
                  <Button variant="neutral" onClick={() => form.reset()}>
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
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};
