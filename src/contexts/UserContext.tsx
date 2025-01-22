"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";
import { useGetCurrentUser } from "@/hooks/reactQuery/user/useGetCurrentUser";

const UserContext = createContext({} as any);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn } = useUser();
  const { data: user } = useGetCurrentUser({ isSignedIn });

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
