"use client";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext } from "react";
import { useGetCurrentUser } from "@/hooks/reactQuery/user/useGetCurrentUser";
import { useGetNotification } from "@/hooks/reactQuery/notification/useGetNotification";

const UserContext = createContext({} as any);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: userSignIn } = useUser();
  const { user } = useGetCurrentUser({
    isSignedIn: userSignIn?.id,
  });
  const { data: notifications } = useGetNotification({
    isSignedIn: userSignIn?.id,
  });

  return (
    <UserContext.Provider value={{ user, notifications }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
