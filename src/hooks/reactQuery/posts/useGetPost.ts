import { useInfiniteQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = undefined }) => {
  const res = await fetch(`/api/post?cursor=${pageParam || ""}&limit=10`);
  if (!res.ok) {
    const error = new Error("Failed to fetch posts");

    throw error;
  }
  return res.json();
};

export const useGetPost = ({ getNextPageParam }: any) => {
  return useInfiniteQuery({
    queryKey: ["get.post"],
    queryFn: fetchPosts,
    initialPageParam: undefined,
    getNextPageParam,
  });
};
