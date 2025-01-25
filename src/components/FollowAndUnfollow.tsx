import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { useToggleFollow } from "@/hooks/reactQuery/user/useToggleFollow";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function FollowAndUnfollow({
  userId,
  className,
  size = "sm",
  variant = "noShadow",
  username,
  isFollowing,
}: any) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useToggleFollow({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get.random.user"] });
      queryClient.invalidateQueries({ queryKey: ["get.user"] });
      queryClient.invalidateQueries({
        queryKey: ["get.is.following", username],
      });
      toast({
        title: "Success",
        description: "You have successfully followed this user",
        duration: 2000,
      });
    },
  });

  return (
    <>
      <Button
        size={size}
        variant={isFollowing?.data ? "neutral" : variant}
        onClick={() => mutate({ userId })}
        disabled={isPending}
        className={className}
        // className="w-20"
      >
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : isFollowing?.data ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>
    </>
  );
}
