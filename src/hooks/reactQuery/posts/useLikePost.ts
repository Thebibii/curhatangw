import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

type LikePostProps = {
  postId: string;
  onSuccess: () => void;
};

export const useLikePost = ({ postId, onSuccess }: LikePostProps) => {
  return useMutation({
    mutationKey: ["like.post", postId],
    mutationFn: async () => {
      const res = await fetch(`${baseURL}/post/likes/${postId}`, {
        method: "POST",
      });

      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
