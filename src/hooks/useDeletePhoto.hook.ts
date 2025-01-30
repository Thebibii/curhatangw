import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useDeletePhoto = () => {
  return useMutation({
    mutationKey: ["delete.image"],
    mutationFn: async (body: any) => {
      const res = await fetch(`${baseURL}/uploadthing/`, {
        method: "DELETE",
        body: JSON.stringify({
          url: body.imageUrl,
        }),
      });

      const data = await res.json();

      return data;
    },
  });
};
