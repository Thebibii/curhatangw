import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useCreateComment = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["get.comment"],
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
