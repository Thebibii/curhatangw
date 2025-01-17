import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

type CreatePostInput = {
  content: string | null;
  image: string | null;
};

export const useCreatePost = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["create.post"],
    mutationFn: async (body: CreatePostInput) => {
      const postResponse = await axiosInstance.post("/post/create", body);

      return postResponse;
    },
    onSuccess,
  });
};
