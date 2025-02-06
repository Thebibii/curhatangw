import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetDetailPost = ({ postId }: { postId: string }) => {
  return useQuery({
    queryKey: ["get.detail.post", postId],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/post/${postId}/detail`);

      const data = await res.json();

      return data;
    },
  });
};
