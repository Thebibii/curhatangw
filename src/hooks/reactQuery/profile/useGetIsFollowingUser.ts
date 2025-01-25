import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetIsFollowingUser = ({ username }: any) => {
  const usernameDecoded = decodeURIComponent(username);

  return useQuery({
    queryKey: ["get.is.following", usernameDecoded],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/user/follow/${usernameDecoded}`);

      const data = await res.json();

      return data;
    },
  });
};
