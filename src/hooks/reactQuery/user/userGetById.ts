import { axiosInstance } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useUserByClerkId = ({
  isSignedIn,
}: {
  isSignedIn: boolean | undefined;
}) => {
  return useQuery({
    queryKey: ["get.user"],
    queryFn: async () => {
      const userResponse = await axiosInstance.get("/user/userbyid");
      return userResponse;
    },
    enabled: isSignedIn ? true : false,
  });
};
