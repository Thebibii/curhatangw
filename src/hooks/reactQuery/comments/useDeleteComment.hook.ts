import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useDeleteComment = ({
  onSuccess,
}: {
  onSuccess: (body: any) => void;
}) => {
  return useMutation({
    mutationKey: ["delete.comment"],
    mutationFn: async (body: any) => {
      const res = await fetch(`${baseURL}/comment/${body.commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
