import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetTags = ({
  tag_ids,
  tag_names,
  isFetch,
}: {
  tag_ids: string[];
  tag_names: string;
  isFetch: boolean;
}) => {
  const query = new URLSearchParams({
    tag_ids: tag_ids.join(","),
    tag_names,
  }).toString();

  return useQuery({
    queryKey: ["get.tags", tag_ids, tag_names],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/tag?${query}`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tags");
      }

      return res.json();
    },
    enabled: !!isFetch,
  });
};
