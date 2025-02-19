import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetRandomUser = (isSignedIn: string | undefined) => {
  return useQuery({
    queryKey: ["get.random.user"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/user/random`, {
        method: "GET",
      });

      const data = await res.json();

      return data;
    },
    enabled: !!isSignedIn,
    refetchOnWindowFocus: false,
  });
};
