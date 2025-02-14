import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetTags = () => {
  return useQuery({
    queryKey: ["get.tags"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/tag`);

      const data = await res.json();

      return data;
    },
  });
};
