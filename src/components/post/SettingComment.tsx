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

export default function SettingComment({
  commentId,
  refetch,
}: {
  commentId: string;
  refetch: () => void;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <DeleteCommentDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        commentId={commentId}
        refetch={refetch}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <MoreHorizontalIcon className="w-4 aspect-square cursor-pointer hover:text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" className="bg-bw" align="start">
          <DropdownMenuItem className="cursor-pointer bg-bw">
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
  return (
    <AlertDialog open={openDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpenDeleteDialog(false)}
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate({ commentId })}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
