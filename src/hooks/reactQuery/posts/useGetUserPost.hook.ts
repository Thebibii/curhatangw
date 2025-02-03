import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetUserPost = ({ username }: { username: string }) => {
  return useQuery({
    queryKey: ["get.post", username],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/post/user/${username}`);

      const data = await res.json();

      return data;
    },
    enabled: username ? true : false,
  });
};
