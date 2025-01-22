import { axiosInstance } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

type UpdateCurrentUserInput = {
  name: string;
  bio: string | null;
  location: string | null;
  website: string | null;
};

export const useUpdateCurrentUser = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["update.user"],
    mutationFn: async (body: UpdateCurrentUserInput) => {
      const postResponse = await axiosInstance.post("/user", body);

      return postResponse;
    },
    onSuccess,
  });
};
