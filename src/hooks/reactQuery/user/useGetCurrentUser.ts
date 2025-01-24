import { axiosInstance } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = ({
  isSignedIn,
}: {
  isSignedIn: boolean | undefined;
}) => {
  const { data: user } = useQuery({
    queryKey: ["get.user"],
    queryFn: async () => {
      const userResponse = await axiosInstance.get("/user");
      return await userResponse.data;
    },
    enabled: isSignedIn ? true : false,
    refetchInterval: isSignedIn ? 0 : 700,
  });
  return { user };
};
