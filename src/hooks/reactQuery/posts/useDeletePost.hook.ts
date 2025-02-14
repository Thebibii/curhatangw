import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

type DeletePostProps = {
  postId: string;
  onSuccess: (body: any) => void;
};

export const useDeletePost = ({ postId, onSuccess }: DeletePostProps) => {
  return useMutation({
    mutationKey: ["delete.post", postId],
    mutationFn: async () => {
      const res = await fetch(`${baseURL}/post/${postId}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
