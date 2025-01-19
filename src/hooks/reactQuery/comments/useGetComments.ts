import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentByPost = ({ postId }: any) => {
  return useQuery({
    queryKey: ["get.comment", postId],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/comment/post/${postId}`);

      const data = await res.json();

      return data;
    },
    enabled: false,
  });
};
