import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["get.notifications"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/notifications`);

      const data = await res.json();

      return data;
    },
  });
};
