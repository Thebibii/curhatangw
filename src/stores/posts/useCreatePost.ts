import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

type CreatePostInput = {
  title: string;
  content: string;
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
