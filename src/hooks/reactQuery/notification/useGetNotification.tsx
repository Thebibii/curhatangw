import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetNotification = () => {
  return useQuery({
    queryKey: ["get.notification"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/notifications`);

      const data = await res.json();

      return data;
    },
  });
};
