import { axiosInstance } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = ({
  isSignedIn,
}: {
  isSignedIn: boolean | undefined;
}) => {
  return useQuery({
    queryKey: ["get.user"],
    queryFn: async () => {
      const userResponse = await axiosInstance.get("/user");
      return await userResponse.data;
    },
    enabled: isSignedIn ? true : false,
  });
};
