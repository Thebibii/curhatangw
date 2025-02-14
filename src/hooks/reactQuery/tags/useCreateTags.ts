import { baseURL } from "@/lib/db/env";
import { useMutation } from "@tanstack/react-query";

export const useCreateTag = ({
  onSuccess,
}: {
  onSuccess: (body: any) => void;
}) => {
  return useMutation({
    mutationKey: ["create.tags"],
    mutationFn: async (body: any) => {
      const res = await fetch(`${baseURL}/tag`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json();

      return data;
    },
    onSuccess,
  });
};
