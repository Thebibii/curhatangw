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
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "@/hooks/reactQuery/posts/useDeletePost.hook";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePhoto } from "@/hooks/useDeletePhoto.hook";
import { Icons } from "./icons";
import { Fragment, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import InputTags from "./post/create/InputTags";
import { useForm } from "react-hook-form";
import { useEditPost } from "@/hooks/reactQuery/posts/useEditPost.hook";
import FollowAndUnfollow from "./FollowAndUnfollow";
import { useUserContext } from "@/contexts/UserContext";
import { Label } from "./ui/label";
import { Tag } from "@/types/tag";

type DropdownMenuPost = {
  postId: string;
  imageUrl: string;
  content: string;
  userId: string;
  username: string;
  isFollowing: boolean;
  currentUser: string;
};

type TDeletePost = {
  title?: string;
  description?: string;

  openDeleteDialog: boolean | undefined;
  setOpenDeleteDialog: (
    value: React.SetStateAction<boolean>
  ) => void | undefined;
  imageUrl: string | undefined;
  postId: string;
};

type TEditPost = {
  title?: string;
  description?: string;
  content: string;
  openEditDialog: boolean | undefined;
  setOpenEditDialog: (value: React.SetStateAction<boolean>) => void | undefined;
  imageUrl: string | undefined;
  postId: string;
};

export function DropdownMenuPost({
  postId,
  imageUrl,
  userId,
  username,
  content,
  currentUser,
  isFollowing,
}: DropdownMenuPost) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  return (
    <Fragment>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="h-auto w-auto p-0 focus-visible:ring-0 hover:text-main rounded-full  focus-visible:ring-offset-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.MoreHorizontalIcon className="w-4 aspect-square cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="bg-bw z-[1000]"
          side="left"
          align="start"
          forceMount
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {userId === currentUser && (
            <>
              <DropdownMenuItem
                className="bg-bw hover:bg-destructive hover:text-bw"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete Post
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenEditDialog(true)}
                className="bg-bw hover:bg-[#F1F5F9]"
              >
                Edit Post
              </DropdownMenuItem>
            </>
          )}
          {userId !== currentUser && (
            <DropdownMenuItem className="bg-bw hover:bg-[#F1F5F9] group">
              <FollowAndUnfollow
                userId={userId}
                username={username}
                isFollowing={isFollowing}
                className="py-1.5 px-0 h-0 justify-start w-full text-sm border-0 bg-bw group-hover:bg-[#F1F5F9]"
              />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostModal
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        imageUrl={imageUrl}
        postId={postId}
      />
      <EditPostModal
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        imageUrl={imageUrl}
        postId={postId}
        content={content}
      />
    </Fragment>
  );
}

const DeletePostModal = ({
  openDeleteDialog,
  title = "Delete Post",
  description = "This action cannot be undone.",
  setOpenDeleteDialog,
  imageUrl,
  postId,
}: TDeletePost) => {
  const queryClient = useQueryClient();

  const { mutate: deletePhoto } = useDeletePhoto();
  const { isPending, mutate, isSuccess } = useDeletePost({
    postId,
    onSuccess: async ({ data: body }: { data: { id: string } }) => {
      queryClient.invalidateQueries({ queryKey: ["get.post"] });
      /*   const queryFilter: QueryFilters = { // untuk memperbarui cache
        queryKey: ["get.post"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData: ApiPostsInfinite) => {
        if (!oldData) return;

        return {
          pageParams: oldData?.pageParams,
          pages: oldData?.pages?.map((page: any) => ({
            nextCursor: page.nextCursor,
            data: page.data.filter((p: any) => p.id !== body.id),
          })),
        };
      });
      */
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
        duration: 1500,
      });
      setOpenDeleteDialog(false);
    },
  });

  return (
    <AlertDialog open={openDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (imageUrl) {
                deletePhoto({ imageUrl });
              }
              mutate();
            }}
            className="bg-red-500 hover:bg-red-600"
            disabled={isSuccess || isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const EditPostModal = ({
  openEditDialog,
  setOpenEditDialog,
  postId,
  content,
}: TEditPost) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { content: content },
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useEditPost({
    postId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.post"] });
      toast({
        title: "Post deleted",
        description: "Your post has been updated successfully",
        duration: 1500,
      });
      setOpenEditDialog(false);
    },
  });

  const textContent = watch("content");

  const onSubmit = ({ content }: { content: string }) => {
    mutate({ content });
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent
        className="max-w-[425px]"
        onPointerDownOutside={(e) => {
          // Prevent dialog from closing when clicking on popover
          const target = e.target as HTMLElement;
          if (target.closest("[data-popover-content]")) {
            e.preventDefault();
          }
        }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogDescription>
          Make changes to your post here. Click save when you're done.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full space-y-4">
            <div className="flex flex-col space-y-2 ">
              <Label htmlFor="tags">Tags</Label>
              <InputTags
                tags={tags}
                setTags={setTags}
                tagInput={tagInput}
                setTagInput={setTagInput}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="content" className="font-semibold">
                Message
              </Label>
              <Textarea
                disabled={isPending}
                placeholder="What's on your mind?"
                {...register("content", { required: true })}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size={"sm"}
                disabled={!textContent.trim() || isPending}
              >
                Save changes
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
