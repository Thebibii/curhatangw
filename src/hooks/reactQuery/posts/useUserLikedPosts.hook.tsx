import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useUserLikedPosts = ({ username }: any) => {
  const usernameDecoded = decodeURIComponent(username);

  return useQuery({
    queryKey: ["get.user.likes", usernameDecoded],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/user/${usernameDecoded}/likes`);

      const data = await res.json();

      return data;
    },
  });
};
