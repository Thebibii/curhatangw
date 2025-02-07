import { getRandomUsers } from "@/actions/user.action";
import { useQuery } from "@tanstack/react-query";

export const useGetRandomUser = (isSignedIn: string | undefined) => {
  return useQuery({
    queryKey: ["get.random.user"],
    queryFn: async () => {
      const res = await getRandomUsers();

      const data = res;

      return data;
    },
    enabled: !!isSignedIn,
  });
};
