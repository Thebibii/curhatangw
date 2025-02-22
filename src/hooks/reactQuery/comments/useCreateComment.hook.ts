import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useCreateComment = ({
  postId,
  onSuccess,
  onError,
}: {
  postId: string;
  onSuccess: (body: any) => void;
  onError?: (body: any) => void;
}) => {
  return useMutation({
    mutationKey: ["get.comment", postId],
    mutationFn: async (body: any) => {
      const res = await fetch(`${baseURL}/comment`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(errorData.message);
      }

      const data = await res.json();

      return data;
    },
    onSuccess,
    onError,
  });
};
