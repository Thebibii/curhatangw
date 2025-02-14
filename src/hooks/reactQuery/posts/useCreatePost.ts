import { axiosInstance } from "@/lib/db/env";
import { Tag } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

type CreatePostInput = {
  content: string | null;
  image: string | null;
  tags: Tag[];
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
