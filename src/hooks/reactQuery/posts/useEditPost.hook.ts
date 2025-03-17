import { axiosInstance, baseURL } from "@/lib/db/env";
import { Tag } from "@/types/tag";
import { useMutation } from "@tanstack/react-query";

type TEditPost = {
  postId: string;
  onSuccess: (body: any) => void;
};

type EditPostInput = {
  content: string;
  image?: string | null;
  tags?: Tag[];
};

export const useEditPost = ({ postId, onSuccess }: TEditPost) => {
  return useMutation({
    mutationKey: ["edit.post", postId],
    mutationFn: async (body: EditPostInput) => {
      const res = await fetch(`${baseURL}/post/${postId}/update`, {
        method: "PATCH",
        body: JSON.stringify({
          content: body.content,
          image: body.image,
          tags: body.tags,
        }),
      });
      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
