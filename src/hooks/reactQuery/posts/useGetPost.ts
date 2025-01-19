/* import { axiosInstance } from "@/lib/env";
import { useQuery } from "@tanstack/react-query";

export const useGetPost = () => {
  return useQuery({
    queryKey: ["get.post"],
    queryFn: async () => {
      const postResponse = await axiosInstance.get("/post");
      return postResponse;
    },
  });
}; */
import { baseURL } from "@/lib/env";
import { useQuery } from "@tanstack/react-query";

export const useGetPost = () => {
  return useQuery({
    queryKey: ["get.post"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/post`);
      const data = await res.json();

      return data;
    },
  });
};
