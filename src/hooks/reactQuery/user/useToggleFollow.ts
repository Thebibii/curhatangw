import { axiosInstance } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

type FollowUser = {
  userId: string;
};

export const useToggleFollow = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["follow.user"],
    mutationFn: async (body: FollowUser) => {
      const postResponse = await axiosInstance.post("/follow", body);

      return postResponse;
    },
    onSuccess,
  });
};
