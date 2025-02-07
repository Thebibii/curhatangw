import { baseURL } from "@/lib/db/env";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["read.notifications"],
    mutationFn: async (notificationIds: any) => {
      const res = await fetch(`${baseURL}/notifications`, {
        method: "PATCH",
        body: JSON.stringify({ notificationIds }),
      });
      const data = await res.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get.user"] });
    },
  });
};
