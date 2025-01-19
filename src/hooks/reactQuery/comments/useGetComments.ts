import { baseURL } from "@/lib/env";
import { useQuery } from "@tanstack/react-query";

export const useGetCommentByPost = ({ postId }: any) => {
  return useQuery({
    queryKey: ["get.comment", postId],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/comment/${postId}`);

      const data = await res.json();
      console.log(data);

      return data;
    },
  });
};
