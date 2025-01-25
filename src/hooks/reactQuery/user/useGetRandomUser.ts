import { getRandomUsers } from "@/actions/user.action";
import { baseURL } from "@/lib/db/env";
import { useQuery } from "@tanstack/react-query";

export const useGetRandomUser = () => {
  return useQuery({
    queryKey: ["get.random.user"],
    queryFn: async () => {
      const res = await getRandomUsers();

      const data = res;

      return data;
    },
  });
};
