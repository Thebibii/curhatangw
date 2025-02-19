import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetTagByTrending = () => {
  return useQuery({
    queryKey: ["get.tags.trending"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/tag/trending`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tags");
      }

      return res.json();
    },
  });
};
