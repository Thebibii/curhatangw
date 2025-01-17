import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useGetPost = () => {
  return useQuery({
    queryKey: ["get.post"],
    queryFn: async () => {
      const postResponse = await axiosInstance.get("/post");
      return postResponse;
    },
  });
};
