import { axiosInstance } from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export const useUserByClerkId = () => {
  return useQuery({
    queryKey: ["get.user"],
    queryFn: async () => {
      const userResponse = await axiosInstance.get("/user/userbyid");
      return userResponse;
    },
  });
};
