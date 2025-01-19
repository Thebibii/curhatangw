import { axiosInstance } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

type CreatePostInput = {
  content: string | null;
  image: string | null;
};

export const useCreatePost = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["create.post"],
    mutationFn: async (body: CreatePostInput) => {
      const postResponse = await axiosInstance.post("/post", body);

      return postResponse;
    },
    onSuccess,
  });
};
