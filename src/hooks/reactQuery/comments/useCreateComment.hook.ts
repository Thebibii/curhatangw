import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useCreateComment = ({
  postId,
  onSuccess,
}: {
  postId: string;
  onSuccess: (body: any) => void;
}) => {
  return useMutation({
    mutationKey: ["get.comment", postId],
    mutationFn: async (body: any) => {
      const res = await fetch(`${baseURL}/comment`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
