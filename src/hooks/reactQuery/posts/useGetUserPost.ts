import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetUserPost = ({ userId }: any) => {
  return useQuery({
    queryKey: ["get.post", userId],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/post/user/${userId}`);

      const data = await res.json();

      return data;
    },
    enabled: userId ? true : false,
  });
};
