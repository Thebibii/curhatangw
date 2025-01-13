import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetPostByUserId = () => {
  return useQuery({
    queryKey: ["getPostByUserId.post"],
    queryFn: async () => {
      const postResponse = await axiosInstance.get("/post");
      return postResponse;
    },
  });
};
