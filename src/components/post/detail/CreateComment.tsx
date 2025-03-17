"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateComment } from "@/hooks/reactQuery/comments/useCreateComment.hook";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

type TProps = {
  postId: string;
  refetch?: () => void;
};

export default function CreateComment({ postId, refetch }: TProps) {
  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: { comment: "" },
  });

  const comment = watch("comment");

  const { mutate, isPending, isError } = useCreateComment({
    postId,
    onSuccess: () => {
      console.log(isError);

      refetch?.();
      reset();
      toast({
        title: "Comment created",
        description: "Your comment has been created successfully",
        duration: 1500,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        duration: 1500,
      });
    },
  });

  const onSubmit = (data: { comment: string }) => {
    mutate({ postId, content: data.comment });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center grow space-x-2"
    >
      <Input
        placeholder="Write a comment..."
        disabled={isPending}
        // autoFocus
        {...register("comment", { required: true })}
      />
      <Button
        type="submit"
        size="sm"
        variant="noShadow"
        className="flex items-center gap-2"
        disabled={!comment.trim() || isPending}
      >
        <Icons.SendIcon className="size-4" />
      </Button>
    </form>
  );
}
