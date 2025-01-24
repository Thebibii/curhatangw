import { axiosInstance } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useWebhook = ({
  isSignedIn,
}: {
  isSignedIn: boolean | undefined;
}) => {
  return useQuery({
    queryKey: ["webhook"],
    queryFn: async () => {
      const userResponse = await axiosInstance.get("/webhooks/clerk");
      console.log(userResponse.data, "userResponse");

      return await userResponse.data;
    },
  });
};
