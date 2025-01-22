import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useProfileByUsername = ({ username }: any) => {
  const usernameDecoded = decodeURIComponent(username);

  return useQuery({
    queryKey: ["get.profile", usernameDecoded],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/profile/${username}`);

      const data = await res.json();

      return data;
    },
  });
};
