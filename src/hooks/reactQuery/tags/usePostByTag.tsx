import { getPostByTag } from "@/actions/tag.action";
import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const usePostByTag = ({
  tag_names,
}: {
  tag_names: string[] | undefined;
}) => {
  const query = new URLSearchParams({
    s: tag_names?.join(" ") ?? "",
  }).toString();

  return useQuery({
    queryKey: ["get.post.tag"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/tag/post?${query}`, {
        method: "GET",
      });
      return res.json() ?? [];
    },
    enabled: !!tag_names?.length,
  });
};
