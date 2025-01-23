import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByName = ({ username }: any) => {
  const usernameDecoded = decodeURIComponent(username);

  return useQuery({
    queryKey: ["get.user", usernameDecoded],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/user/${usernameDecoded}`);

      const data = await res.json();

      return data;
    },
  });
};
