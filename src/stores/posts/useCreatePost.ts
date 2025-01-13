import { axiosInstance } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";

type CreatePostInput = {
  title: string;
  content: string;
  image: string | null;
};

export const useCreatePost = ({ onSuccess }: any) => {
  return useMutation({
    mutationKey: ["create.post"],
    mutationFn: async (body: CreatePostInput) => {
      console.log(body);

      const postResponse = await axiosInstance.post("/post", body);

      return postResponse;
    },
    onSuccess,
  });
};
