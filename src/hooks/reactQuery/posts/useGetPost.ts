import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetPost = () => {
  return useQuery({
    queryKey: ["get.post"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/post`);
      const data = await res.json();

      return data;
    },
  });
};
